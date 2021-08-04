import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { ballot_design } = req.body
  const { election_id } = req.query as { election_id: string }

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return
  if (jwt.ballot_design_finalized) return res.status(401).send({ error: 'Ballot already finalized' })

  // Store ballot_design in db
  await firebase.firestore().collection('elections').doc(election_id).update({ ballot_design })

  return res.status(201).json({ message: 'Saved ballot design' })
}
