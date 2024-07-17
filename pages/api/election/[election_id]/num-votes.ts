import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../_services'

export type NumAcceptedVotes = {
  num_invalidated_votes: number
  num_pending_votes: number
  num_votes: number
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query

  const electionDoc = await firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)
    .get()

  // Is election_id in DB?
  if (!electionDoc.exists) return res.status(400).json({ error: 'Unknown Election ID.' })

  const { num_invalidated_votes = 0, num_pending_votes = 0, num_votes = 0 } = { ...electionDoc.data() }

  const response: NumAcceptedVotes = { num_invalidated_votes, num_pending_votes, num_votes }

  return res.status(200).json(response)
}
