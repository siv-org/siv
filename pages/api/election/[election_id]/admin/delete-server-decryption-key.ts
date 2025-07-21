import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'

import { checkJwtOwnsElection } from '../../../validate-admin-jwt'

const { ADMIN_EMAIL } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!ADMIN_EMAIL) return res.status(501).json({ error: 'Missing process.env.ADMIN_EMAIL' })
  const { election_id } = req.query as { election_id: string }

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)

  if (!jwt.valid) return res.status(401).json({ message: 'Unauthorized' })

  // This special route is restricted only for the server admin
  if (jwt.email !== 'david@siv.org') return res.status(403).json({ message: 'Forbidden' })

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const election = await electionDoc.get()

  // Confirm the election is not accepting new votes
  if (!election.data()?.stop_accepting_votes)
    return res.status(406).json({ message: 'Election must stop collecting new votes first' })

  // Delete the server's decryption key
  await electionDoc
    .collection('trustees')
    .doc(ADMIN_EMAIL)
    .update({ private_key_deleted_at: new Date(), private_keyshare: false })

  return res.status(201).json({ message: 'Done' })
}
