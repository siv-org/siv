import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query

  const election = (
    await firebase
      .firestore()
      .collection('elections')
      .doc(election_id as string)
      .get()
  ).data()

  // Is election_id in DB?
  if (!election) {
    return res.status(400).end('Unknown Election ID.')
  }

  // Return ballot design field
  res.status(200).json(election.ballot_design)
}
