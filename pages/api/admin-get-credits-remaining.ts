import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from './_services'
import { checkJwt } from './validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Confirm they're a valid admin
  const jwt = checkJwt(req, res)
  if (!jwt.valid) return

  // Get all elections created by this admin
  const admin = await firebase.firestore().collection('admin').doc(jwt.email).get()

  res.status(200).send({ credits_remaining })
}
