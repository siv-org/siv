import { firebase } from 'api/_services'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { auth, message } = req.body
  const { election_id } = req.query

  // Store in database on the invalidated_vote doc
  const votes = await firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)
    .collection('invalidated_votes')
    .where('auth', '==', auth)
    .get()
  await Promise.all(
    votes.docs.map((vote) =>
      vote.ref.update({ responses: firestore.FieldValue.arrayUnion({ message, timestamp: new Date() }) }),
    ),
  )

  // TODO: Send admin email

  res.status(200).json({ message: 'Message received' })
}
