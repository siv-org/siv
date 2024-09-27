import { firebase } from 'api/_services'
import { checkJwtOwnsElection } from 'api/validate-admin-jwt'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  // Update ballot_design_finalized in db
  await firebase.firestore().collection('elections').doc(election_id).update({ ballot_design_finalized: true })

  return res.status(201).json({ message: 'Finalized ballot design' })
}
