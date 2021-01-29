import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'

const { ADMIN_PASSWORD } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_manager, password } = req.body
  const { election_id } = req.query as { election_id: string }

  // Check for password
  if (!ADMIN_PASSWORD) return res.status(501).json({ error: 'Missing process.env.ADMIN_PASSWORD' })
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid Password.' })

  // Store election_manager in db
  await firebase.firestore().collection('elections').doc(election_id).update({ election_manager })

  return res.status(201).json({ message: 'Saved election manager' })
}
