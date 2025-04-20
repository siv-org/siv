import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'
import { pusher } from '../../../pusher'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }
  const { auths, review } = req.body

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  // Update voter w/ review
  await Promise.all(
    auths.map((auth_token: string) =>
      firebase
        .firestore()
        .collection('elections')
        .doc(election_id)
        .collection('approved-voters')
        .doc(auth_token)
        .update({ esignature_review: firestore.FieldValue.arrayUnion({ review, reviewed_at: new Date() }) }),
    ),
  )

  await pusher.trigger(`status-${election_id}`, 'votes', '')

  await res.status(201).json({ message: 'Done' })
}
