// given auth and election id, tell us if the vote was invalidated or not

import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { auth, election_id } = req.query

  const voters = await firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)
    .collection('voters')
    .where('auth_token', '==', auth)
    .get()

  return res.status(200).json(!!voters.docs[0]?.data().invalidated_at)
}
