import { NextApiRequest, NextApiResponse } from 'next'
import { default_ballot_design } from 'src/admin/BallotDesign/default-ballot-design'

import { firebase } from './_services'
import { checkJwt } from './validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_title, timezone_offset } = req.body

  // Confirm they're a valid admin
  const jwt = checkJwt(req, res)
  if (!jwt.valid) return

  // Create a new election
  const election_id = Number(new Date()).toString()
  const election = firebase.firestore().collection('elections').doc(election_id)

  // Generate fallback title using client's timezone if provided
  let fallbackTitle: string
  if (election_title) {
    fallbackTitle = election_title
  } else if (timezone_offset !== undefined) {
    // Use client's timezone offset to create date in their timezone
    const now = new Date()
    const clientTime = new Date(now.getTime() - timezone_offset * 60 * 1000)
    fallbackTitle = clientTime.toString().slice(0, 21)
  } else {
    // Fallback to server timezone if no timezone offset provided
    fallbackTitle = new Date().toString().slice(0, 21)
  }

  await election.set({
    ballot_design: default_ballot_design,
    created_at: new Date(),
    creator: jwt.email,
    election_manager: jwt.name,
    election_title: fallbackTitle,
    num_invalidated_votes: 0,
    num_voters: 0,
    num_votes: 0,
    voter_applications_allowed: false,
  })

  // Send back our new election_id
  return res.status(201).json({ election_id })
}
