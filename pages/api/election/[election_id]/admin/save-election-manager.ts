import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'
import { checkJwt } from '../../../validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_manager } = req.body
  const { election_id } = req.query as { election_id: string }

  // Confirm they're a valid admin
  const jwt = checkJwt(req, res)
  if (!jwt.valid) return

  // Store election_manager in db
  await firebase.firestore().collection('elections').doc(election_id).update({ election_manager })

  return res.status(201).json({ message: 'Saved election manager' })
}
