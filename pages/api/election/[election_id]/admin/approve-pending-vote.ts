// import { firebase, pushover } from 'api/_services'
import { pushover } from 'api/_services'
import { checkJwtOwnsElection } from 'api/validate-admin-jwt'
// import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

import { PendingVote } from './load-admin'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }
  const { votes_to_approve } = req.body as { votes_to_approve?: PendingVote[] }

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  // Send admin notif that they're trying to use WIP endpoint
  await pushover(
    `${jwt.election_manager} tried approving ${(votes_to_approve || []).length} votes`,
    `${jwt.election_title} (${election_id})`,
  )

  // Fail with error that this is WIP.
  return res
    .status(400)
    .json({ error: 'Approving votes from shareable link is still a work-in-progress. Notified SIV admin for you.' })

  // Old code copied in from invalidate-voters.ts.
  // Work in progress to convert for approving pending votes.
  // See: https://github.com/dsernst/siv/pull/152#issuecomment-2212417637

  //     const db = firebase.firestore()
  //     const electionDoc = db.collection('elections').doc(election_id)

  //   await Promise.all(
  //     votes_to_approve.map(async (votes) => {
  //     //   const voterRef = electionDoc.collection('voters').doc(voter.email)
  //     //   const votes = await electionDoc.collection('votes').where('auth', '==', voter.auth_token).get()

  //       // Do all in parallel
  //         // 1. Mark the auth token as invalidated
  //         voterRef.update({ invalidated_at: new Date() }),

  //         // 2. Move pending-vote to 'votes' collection
  //           await Promise.all(
  //             votes.docs.map(async (vote) => {
  //               const invalidatedVote = { ...vote.data(), invalidated_at: new Date() }
  //               await electionDoc.collection('invalidated_votes').doc(vote.id).set(invalidatedVote)
  //               await vote.ref.delete()
  //               await electionDoc.update({ num_invalidated_votes: firestore.FieldValue.increment(1) })
  //             }),
  //           )
  //         }),
  //       ])
  //     }),
  //   )
  //
  // return res.status(201).json({ message: 'Done' })
}
