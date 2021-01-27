import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from './_services'

const { ADMIN_PASSWORD } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Ensure env-vars are set
  if (!ADMIN_PASSWORD) return res.status(501).json({ error: 'Missing process.env.ADMIN_PASSWORD' })

  const { election_title, password } = req.body

  // Check password
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid Password.' })

  // Create a new election
  const election_id = Number(new Date()).toString()
  const election = firebase.firestore().collection('elections').doc(election_id)
  await election.set({ created_at: new Date(), election_title })

  // Send back our new election_id
  return res.status(201).json({ election_id })
}
