import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover, storageBucket } from './_services'

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

export async function saveAdminFileUpload({
  election_id,
  election_title,
  format,
  name,
  notification_title,
  req,
  res,
  uploaded_by,
  validate,
}: {
  election_id: string
  election_title: string
  format?: (buffer: Buffer, filename: string) => string | undefined
  name: string
  notification_title: string
  req: NextApiRequest
  res: NextApiResponse
  uploaded_by: string
  validate?: (buffer: Buffer, filename: string) => string | undefined
}) {
  const { content_base64, filename, mime_type } = req.body

  // Validate file
  if (typeof filename !== 'string' || !filename.trim()) return res.status(400).json({ error: 'Missing filename' })
  if (typeof content_base64 !== 'string' || !content_base64)
    return res.status(400).json({ error: 'Missing file content' })
  const buffer = Buffer.from(content_base64, 'base64')
  if (!buffer.length) return res.status(400).json({ error: 'Empty file' })
  if (buffer.length > MAX_BYTES) return res.status(400).json({ error: 'File too large (max 10 MB)' })

  const safeFilename =
    (filename.split(/[/\\]/).pop() || 'upload').replace(/[^\w.\-()+ ]/g, '_').slice(0, 200) || 'upload'
  const validationError = validate?.(buffer, safeFilename)
  if (validationError) return res.status(400).json({ error: validationError })

  const uploadId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const storagePath = `${name}/${election_id}/${uploadId}-${safeFilename}`

  try {
    await storageBucket()
      .file(storagePath)
      .save(buffer, {
        metadata: { contentType: typeof mime_type === 'string' ? mime_type : 'application/octet-stream' },
      })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`${notification_title.toLowerCase()}: storage save failed`, message)
    await pushover(`${notification_title}: Storage failed`, `${election_id}\n${safeFilename}\n${message}`)
    return res.status(503).json({ error: 'File storage failed. Our team has been alerted, please try again shortly.' })
  }

  const detectedFormat = format?.(buffer, safeFilename)

  await firebase
    .firestore()
    .collection('elections')
    .doc(election_id)
    .collection(name)
    .doc(uploadId)
    .set({
      filename: safeFilename,
      format: detectedFormat ?? 'unknown',
      mime_type: typeof mime_type === 'string' ? mime_type : null,
      size: buffer.length,
      storage_path: storagePath,
      uploaded_at: new Date(),
      uploaded_by,
    })

  await pushover(
    notification_title,
    `${election_title} (${election_id})\n${safeFilename} (${buffer.length} bytes)\nformat: ${
      detectedFormat ?? 'unknown'
    }`,
  )

  return { format: detectedFormat, success: true }
}
