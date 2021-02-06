import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'

const { ADMIN_PASSWORD } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { esignature_requested, password } = req.body
  const { election_id } = req.query as { election_id: string }

  // Check for password
  if (!ADMIN_PASSWORD) return res.status(501).json({ error: 'Missing process.env.ADMIN_PASSWORD' })
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid Password.' })

  // Store in db
  await firebase.firestore().collection('elections').doc(election_id).update({ esignature_requested })

  return res.status(201).json({ message: 'Saved esignature_requested' })
}
