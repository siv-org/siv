import { NextApiRequest, NextApiResponse } from 'next'
import { check_for_fatal_ballot_errors } from 'src/admin/BallotDesign/check_for_ballot_errors'

import { saveAdminFileUpload } from '../../../_admin-file-upload'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'

export const config = { api: { bodyParser: { sizeLimit: '15mb' } } }

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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { election_id } = req.query as { election_id: string }

  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return
  if (jwt.ballot_design_finalized) return res.status(401).json({ error: 'Ballot already finalized' })

  const result = await saveAdminFileUpload({
    election_id,
    election_title: jwt.election_title,
    format: detectFormat,
    name: 'ballot-design-uploads',
    notification_title: 'Ballot design upload',
    req,
    res,
    uploaded_by: jwt.email,
  })
  if (result) return res.status(201).json(result)
}
