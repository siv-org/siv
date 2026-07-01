import { NextApiRequest, NextApiResponse } from 'next'
import { check_for_fatal_ballot_errors } from 'src/admin/BallotDesign/check_for_ballot_errors'

import { firebase, pushover } from '../../../_services'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'

const MAX_BYTES = 4 * 1024 * 1024

export const config = { api: { bodyParser: { sizeLimit: '5mb' } } }

function detectFormat(buffer: Buffer, filename: string): 'siv_json' | undefined {
  const looksJson = filename.toLowerCase().endsWith('.json') || buffer[0] === 0x7b || buffer[0] === 0x5b
  if (!looksJson) return undefined

  try {
    const text = buffer.toString('utf8')
    if (!check_for_fatal_ballot_errors(text)) return 'siv_json'
  } catch {
    // not valid SIV JSON
  }
  return undefined
}

function sanitizeFilename(filename: string) {
  const base = filename.split(/[/\\]/).pop() || 'upload'
  return base.replace(/[^\w.\-()+ ]/g, '_').slice(0, 200) || 'upload'
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { content_base64, filename, mime_type } = req.body
  const { election_id } = req.query as { election_id: string }

  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return
  if (jwt.ballot_design_finalized) return res.status(401).json({ error: 'Ballot already finalized' })

  if (typeof filename !== 'string' || !filename.trim()) return res.status(400).json({ error: 'Missing filename' })
  if (typeof content_base64 !== 'string' || !content_base64)
    return res.status(400).json({ error: 'Missing file content' })

  let buffer: Buffer
  try {
    buffer = Buffer.from(content_base64, 'base64')
  } catch {
    return res.status(400).json({ error: 'Invalid file content' })
  }

  if (!buffer.length) return res.status(400).json({ error: 'Empty file' })
  if (buffer.length > MAX_BYTES) return res.status(400).json({ error: 'File too large (max 4 MB)' })

  const safeFilename = sanitizeFilename(filename)
  const uploadId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const storagePath = `ballot-design-uploads/${election_id}/${uploadId}-${safeFilename}`

  await firebase
    .storage()
    .bucket()
    .file(storagePath)
    .save(buffer, {
      metadata: { contentType: typeof mime_type === 'string' ? mime_type : 'application/octet-stream' },
    })

  const format = detectFormat(buffer, safeFilename)

  await firebase
    .firestore()
    .collection('elections')
    .doc(election_id)
    .collection('ballot-design-uploads')
    .doc(uploadId)
    .set({
      filename: safeFilename,
      format: format ?? 'unknown',
      mime_type: typeof mime_type === 'string' ? mime_type : null,
      size: buffer.length,
      storage_path: storagePath,
      uploaded_at: new Date(),
      uploaded_by: jwt.email,
    })

  await pushover(
    'Ballot design upload',
    `${jwt.election_title} (${election_id})\n${safeFilename} (${buffer.length} bytes)\nformat: ${format ?? 'unknown'}`,
  )

  return res.status(201).json({ format, success: true })
}
