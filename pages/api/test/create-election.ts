import { NextApiRequest, NextApiResponse } from 'next'
import { default_ballot_design } from 'src/admin/BallotDesign/default-ballot-design'

import { firebase } from '../_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Security: Only allow in development - explicitly check for 'development'
  // If NODE_ENV is undefined, 'production', 'staging', or anything else, block access
  if (process.env.NODE_ENV !== 'development')
    return res.status(403).json({ error: 'Test endpoints only available in development' })

  const election_id = req.body.election_id
  // Security: Only allow election IDs that start with "test-" to prevent affecting production elections
  if (!election_id.startsWith('test-')) return res.status(400).json({ error: 'Election ID must start with "test-"' })

  const election = firebase.firestore().collection('elections').doc(election_id)

  await election.set({
    ballot_design: default_ballot_design,
    created_at: new Date(),
    creator: 'test-runner',
    election_manager: 'Test Runner',
    election_title: req.body.election_title || `Test Election ${election_id}`,
    num_invalidated_votes: 0,
    num_pending_votes: 0,
    num_voters: 0,
    num_votes: 0,
    voter_applications_allowed: true,
  })

  return res.status(201).json({ election_id })
}
