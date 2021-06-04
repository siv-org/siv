import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'
import { pusher } from '../../../pusher'

const { ADMIN_PASSWORD } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }
  const { emails, password, review } = req.body

  // Check password
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid Password.' })

  // Update voter w/ review
  await Promise.all(
    emails.map((email: string) =>
      firebase
        .firestore()
        .collection('elections')
        .doc(election_id)
        .collection('voters')
        .doc(email)
        .update({ esignature_review: firestore.FieldValue.arrayUnion({ review, reviewed_at: new Date() }) }),
    ),
  )

  await pusher.trigger(`status-${election_id}`, 'votes', '')

  await res.status(201).json({ message: 'Done' })
}
