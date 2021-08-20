import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'

export type QueueLog = { result: string; time: Date }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }
  const { voters } = req.body

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  await Promise.all(
    voters.map((voter: string) =>
      firebase
        .firestore()
        .collection('elections')
        .doc(election_id)
        .collection('voters')
        .doc(voter)
        .update({ invalidated_at: new Date() }),
    ),
  )

  await res.status(201).json({ message: 'Done' })
}
