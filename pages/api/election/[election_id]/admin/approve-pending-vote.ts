import { firebase, pushover } from 'api/_services'
import { checkJwtOwnsElection } from 'api/validate-admin-jwt'
import { NextApiRequest, NextApiResponse } from 'next'

import { PendingVote } from './load-admin'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }
  const { votes_to_approve } = req.body as { votes_to_approve?: PendingVote[] }

  if (!votes_to_approve) return res.status(400).json({ error: 'Missing votes to approve' })

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  //
  // Move them from 'votes-pending' to 'votes
  //
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  const amount = votes_to_approve.length
  let index = 0
  const intervalToReport = 10

  for (const vote of votes_to_approve) {
    const pendingVote = await electionDoc.collection('votes-pending').doc(vote.link_auth).get()
    if (!pendingVote.exists) {
      await pushover(
        `${jwt.election_manager} tried approving missing vote`,
        `${vote.link_auth}${jwt.election_title} (${election_id})\n\n${vote.link_auth}`,
      )
      console.log(`Vote ${vote.link_auth} not found in 'votes-pending' collection (${election_id})`)
      continue
    }

    // Copy vote to 'votes' collection
    await electionDoc
      .collection('votes')
      .doc(vote.link_auth)
      .set({ ...pendingVote.data(), auth: vote.link_auth })

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
    index++

    // Report progress
    if (index % intervalToReport === 0) console.log(`${index}/${amount} - ${((index / amount) * 100).toFixed(0)}%`)
  }

  return res.status(201).json({ message: 'Done' })
}
