import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'

import { checkJwtOwnsElection } from '../../../validate-admin-jwt'

const { ADMIN_EMAIL } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!ADMIN_EMAIL) return res.status(501).json({ error: 'Missing process.env.ADMIN_EMAIL' })

  const { election_id } = req.query as { election_id: string }

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  // Get admin's key status
  const admin = await electionDoc.collection('trustees').doc(ADMIN_EMAIL).get()
  const server_has_private_key = !!admin.data()?.private_keyshare

  return res.status(200).json({ server_has_private_key })
}
