import { NextApiRequest, NextApiResponse } from 'next'

import { getStatus } from '../../../../src/admin/Voters/Signature'
import { firebase } from '../../_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id, num_new_accepted_votes, num_new_pending_votes } = req.query
  // console.log({ election_id, num_new_accepted_votes, num_new_pending_votes })

  const electionDoc = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin preloading
  let votesQuery = electionDoc.collection('approved-voters').where('voted_at', '!=', null).orderBy('voted_at')
  let pendingVotesQuery = electionDoc.collection('votes-pending').orderBy('created_at')
  if (num_new_accepted_votes) votesQuery = votesQuery.limitToLast(+num_new_accepted_votes)
  if (num_new_pending_votes) pendingVotesQuery = pendingVotesQuery.limitToLast(+num_new_pending_votes)
  const loadVotes = votesQuery.get()
  const loadPendingVotes = pendingVotesQuery.get()

  const election = await electionDoc.get()

  // Is election_id in DB?
  if (!election.exists) return res.status(400).json({ error: 'Unknown Election ID.' })

  const votes = (await loadVotes).docs
    .map((doc) => {
      const { auth_token, encrypted_vote, esignature_review, invalidated_at } = doc.data()
      const vote = { auth: auth_token, ...encrypted_vote }

      // Filter out invalidated votes
      if (invalidated_at) return null

      // If esignatures enabled, include review status
      if (election.data()?.esignature_requested) {
        vote.signature_approved = getStatus(esignature_review) === 'approve'
      }

      return vote
    })
    .filter((v) => v)

  const pendingVotes = (await loadPendingVotes).docs.map((doc) => {
    const { encrypted_vote } = doc.data()
    return { auth: 'pending', ...encrypted_vote }
  })

  return res.status(200).json([...votes, ...pendingVotes])
}
