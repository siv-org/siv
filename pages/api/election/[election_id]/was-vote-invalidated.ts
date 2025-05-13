// given auth and election id, tell us if the vote was invalidated or not

import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { auth, election_id } = req.query
  if (typeof election_id !== 'string') return res.status(401).json({ error: `Missing election_id` })
  if (typeof auth !== 'string') return res.status(401).json({ error: `Missing auth` })

  const voter = await firebase
    .firestore()
    .collection('elections')
    .doc(election_id)
    .collection('approved-voters')
    .doc(auth)
    .get()

  return res.status(200).json(!!voter?.data()?.invalidated_at)
}
