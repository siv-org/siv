import { firebase, sendEmail } from 'api/_services'
import { checkJwtOwnsElection } from 'api/validate-admin-jwt'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

import { Voter } from './load-admin'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }
  const { voters_to_invalidate } = req.body as { voters_to_invalidate: Voter[] }

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  await Promise.all(
    voters_to_invalidate.map(async (voter) => {
      const db = firebase.firestore()
      const electionDoc = db.collection('elections').doc(election_id)
      const voterRef = electionDoc.collection('approved-voters').doc(voter.auth_token)
      const has_voted = !!(await voterRef.get()).data()?.voted_at

      // Do all in parallel
      return Promise.all([
        // 1. Mark the auth token as invalidated
        voterRef.update({ invalidated_at: new Date() }),

        // 2. If voted, increment election's cached num_invalidated_votes counter
        (function invalidateVotes() {
          if (!has_voted) return

          return electionDoc.update({ num_invalidated_votes: firestore.FieldValue.increment(1) })
        })(),

        // 3. If voted, notify the voter over email
        (function notifyVoter() {
          if (!has_voted) return

          return sendEmail({
            recipient: voter.email,
            subject: 'Your vote has been invalidated',
            text: `The election administrator ${jwt.election_manager} invalidated your submitted vote in the election "${jwt.election_title}".
        
        If you believe this was an error, you can press reply to write to the Election Administrator.`,
          })
        })(),
      ])
    }),
  )

  return res.status(201).json({ message: 'Done' })
}
