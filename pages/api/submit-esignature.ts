import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from './_services'
import { pusher } from './pusher'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { auth, election_id, esignature } = req.body

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  // Is there an encrypted vote w/ this auth token?
  const [voteDoc] = (await electionDoc.collection('votes').where('auth', '==', auth).get()).docs
  if (!voteDoc.exists) return res.status(404).json({ error: 'No vote w/ this auth_token' })
  // Without an existing esignature?
  if (voteDoc.data().esignature) return res.status(400).json({ error: 'Vote already has an esignature' })

  await electionDoc.collection('votes').doc(voteDoc.id).update({ esignature, esigned_at: new Date() })

  await pusher.trigger(`status-${election_id}`, 'votes', auth)

  res.status(200).send('Success.')
}
