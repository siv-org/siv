import { NextApiRequest, NextApiResponse } from 'next'
import { voter_roll_extensions } from 'src/admin/Voters/UploadVoterRollPanel'

import { saveAdminFileUpload } from '../../../_admin-file-upload'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'

export const config = { api: { bodyParser: { sizeLimit: '15mb' } } }

const fileExtension = (filename: string) => filename.split('.').pop()?.toLowerCase()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { election_id } = req.query as { election_id: string }
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  const result = await saveAdminFileUpload({
    election_id,
    election_title: jwt.election_title,
    format: (_, filename) => fileExtension(filename),
    name: 'voter-roll-uploads',
    notification_title: `${jwt.election_manager} uploaded voter roll`,
    req,
    res,
    uploaded_by: jwt.email,
    validate: (_, filename) =>
      !voter_roll_extensions.includes(fileExtension(filename) || '')
        ? 'Please upload a CSV or spreadsheet file'
        : undefined,
  })
  if (result) return res.status(201).json(result)
}
