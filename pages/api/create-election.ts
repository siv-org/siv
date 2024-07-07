import { NextApiRequest, NextApiResponse } from 'next'
import { default_ballot_design } from 'src/admin/BallotDesign/default-ballot-design'

import { firebase } from './_services'
import { checkJwt } from './validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_title } = req.body

  // Confirm they're a valid admin
  const jwt = checkJwt(req, res)
  if (!jwt.valid) return

  // Create a new election
  const election_id = Number(new Date()).toString()
  const election = firebase.firestore().collection('elections').doc(election_id)
  await election.set({
    ballot_design: default_ballot_design,
    created_at: new Date(),
    creator: jwt.email,
    election_manager: jwt.name,
    election_title,
    num_invalidated_votes: 0,
    num_voters: 0,
    num_votes: 0,
    voter_applications_allowed: false,
  })

  // Send back our new election_id
  return res.status(201).json({ election_id })
}
