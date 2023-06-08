import { firebase, sendEmail } from 'api/_services'
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
      const voterRef = db.collection('elections').doc(election_id).collection('voters').doc(voter.email)

      // Do all in parallel
      return Promise.all([
        // Mark the auth token as invalidated
        voterRef.update({ invalidated_at: new Date() }),

        // If votes were cast with this auth, move them to an 'invalidated-votes' collection
        (async function invalidateVotes() {
          const votes = await db
            .collection('elections')
            .doc(election_id)
            .collection('votes')
            .where('auth', '==', voter.auth_token)
            .get()

          await Promise.all(
            votes.docs.map(async (vote) => {
              const invalidatedVote = { ...vote.data(), invalidated_at: new Date() }
              await db
                .collection('elections')
                .doc(election_id)
                .collection('invalidated_votes')
                .doc(vote.id)
                .set(invalidatedVote)
              await vote.ref.delete()
            }),
          )
        })(),

        // Notify the voter over email
        sendEmail({
          recipient: voter.email,
          subject: 'Your vote has been invalidated',
          text: `The election administrator invalidated your submitted vote.
        
        If you believe this was an error, you can press reply to write to the Election Administrator.`,
        }),
      ])
    }),
  )

  return res.status(201).json({ message: 'Done' })
}
