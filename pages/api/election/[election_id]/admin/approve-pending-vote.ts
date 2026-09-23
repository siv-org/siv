import { firebase, pushover } from 'api/_services'
import { checkJwtOwnsElection } from 'api/validate-admin-jwt'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

import { promoteCachedPendingVotes } from '../cache-accepted'
import { PendingVote } from './load-admin'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }
  const { votes_to_approve } = req.body as { votes_to_approve?: PendingVote[] }

  if (!votes_to_approve) return res.status(400).json({ error: 'Missing votes to approve' })

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  await approvePendingVotes(electionDoc, votes_to_approve, (link_auth) =>
    pushover(
      `${jwt.election_manager} tried approving missing vote`,
      `${link_auth}${jwt.election_title} (${election_id})\n\n${link_auth}`,
    ),
  )

  return res.status(201).json({ message: 'Done' })
}

/** Move pending link-auth votes into `votes` + `voters`. Shared with the test helper. */
export async function approvePendingVotes(
  electionDoc: firestore.DocumentReference,
  votes_to_approve: Pick<PendingVote, 'email' | 'first_name' | 'last_name' | 'link_auth'>[],
  onMissing?: (link_auth: string) => unknown,
) {
  //
  // Move them from 'votes-pending' to 'votes
  //
  const amount = votes_to_approve.length
  let index = 0
  const intervalToReport = 10
  const promoted: { created_at?: firestore.Timestamp; link_auth: string }[] = []

  for (const vote of votes_to_approve) {
    const pendingVote = await electionDoc.collection('votes-pending').doc(vote.link_auth).get()
    if (!pendingVote.exists) {
      await onMissing?.(vote.link_auth)
      console.log(`Vote ${vote.link_auth} not found in 'votes-pending' collection (${electionDoc.id})`)
      continue
    }

    const pendingData = pendingVote.data() || {}

    // Copy vote to 'votes' collection
    await electionDoc
      .collection('votes')
      .doc(vote.link_auth)
      .set({ ...pendingData, auth: vote.link_auth })

    // Copy voter info to 'voters' collection
    const email = `${vote.first_name || 'no_firstname'}.${vote.last_name || 'no_lastname'}..${
      vote.email || 'no_email'
    }...${vote.link_auth}.approved`
    electionDoc.collection('voters').doc(email).set({
      added_at: new Date(),
      auth_token: vote.link_auth,
      email,
      index,
    })

    // Delete from 'votes-pending' collection
    await electionDoc.collection('votes-pending').doc(vote.link_auth).delete()
    promoted.push({ created_at: pendingData.created_at, link_auth: vote.link_auth })
    index++

    // Report progress
    if (index % intervalToReport === 0) console.log(`${index}/${amount} - ${((index / amount) * 100).toFixed(0)}%`)
  }

  if (!index) return

  // Counter + in-place pack promote (pending→accepted is not append-only; cursor would
  // hide the accepted twin if we only bumped counters). Falls back to full reset if needed.
  await Promise.all([
    electionDoc.update({ num_pending_votes: firestore.FieldValue.increment(-index) }),
    promoteCachedPendingVotes(electionDoc, promoted),
  ])
}
