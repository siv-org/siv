import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query

  const electionDoc = await firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)
    .get()

  // Is election_id in DB?
  if (!electionDoc.exists) return res.status(400).json({ error: 'Unknown Election ID.' })

  const { num_votes } = { ...electionDoc.data() } as { num_votes: number }

  return res.status(200).json(num_votes)
}
