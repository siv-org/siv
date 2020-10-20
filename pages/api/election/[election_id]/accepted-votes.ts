import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query

  const election = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Is election_id in DB?
  if (!(await election.get()).exists) {
    return res.status(400).end('Unknown Election ID.')
  }

  // Grab public votes fields
  const votes = (await election.collection('votes').get()).docs.map((doc) => {
    const data = doc.data()
    return { auth: data.auth, vote: data.encrypted_vote }
  })

  res.status(200).json(votes)
}
