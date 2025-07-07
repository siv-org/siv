import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from './_services'
import { pusher } from './pusher'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { auth, election_id, esignature } = req.body

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  // Is there a voter w/ this auth token?
  const voterDoc = electionDoc.collection('approved-voters').doc(auth)
  const voter = await voterDoc.get()
  if (!voter.exists) return res.status(404).json({ error: 'No voter w/ this auth_token' })
  // Without an existing esignature?
  if (voter.data()?.esignature) return res.status(400).json({ error: 'Vote already has an esignature' })

  await voterDoc.update({ esignature, esigned_at: new Date() })

  await pusher.trigger(`status-${election_id}`, 'votes', auth)

  res.status(200).send('Success.')
}
