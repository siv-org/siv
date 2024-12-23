import { firebase, sendEmail } from 'api/_services'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

import { checkJwtOwnsElection } from '../../../validate-admin-jwt'
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
      const voterRef = electionDoc.collection('voters').doc(voter.email)
      const votes = await electionDoc.collection('votes').where('auth', '==', voter.auth_token).get()

      // Do all in parallel
      return Promise.all([
        // 1. Mark the auth token as invalidated
        voterRef.update({ invalidated_at: new Date() }),

        // 2. If votes were cast with this auth, move them to an 'invalidated-votes' collection
        (async function invalidateVotes() {
          await Promise.all(
            votes.docs.map(async (vote) => {
              const invalidatedVote = { ...vote.data(), invalidated_at: new Date() }
              await electionDoc.collection('invalidated_votes').doc(vote.id).set(invalidatedVote)
              await vote.ref.delete()
              await electionDoc.update({ num_invalidated_votes: firestore.FieldValue.increment(1) })
            }),
          )
        })(),

        // 3. Notify the voter over email
        (function notifyVoter() {
          // Skip if they have not voted
          if (!votes.docs.length) return

          // TODO: Skip if voter's email address is unverified, BLOCKED by PR #125 Registration link
          // if (voter.status == 'pending') return

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
