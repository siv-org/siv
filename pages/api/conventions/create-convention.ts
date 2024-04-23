import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../_services'
import { checkJwt } from '../validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { convention_title } = req.body

  // Confirm they're a valid admin
  const jwt = checkJwt(req, res)
  if (!jwt.valid) return

  // Create a new convention
  const convention_id = Number(new Date()).toString()
  const convention = firebase.firestore().collection('conventions').doc(convention_id)
  await convention.set({
    convention_title,
    created_at: new Date(),
    creator: jwt.email,
    id: convention_id,
    num_voters: 0,
  })

  // Send back our new convention_id
  return res.status(201).json({ convention_id })
}
