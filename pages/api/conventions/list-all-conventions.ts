import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../_services'
import { checkJwt } from '../validate-admin-jwt'

export type Convention = {
  convention_title: string
  created_at: { _seconds: number }
  id: string
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Confirm they're a valid admin
  const jwt = checkJwt(req, res)
  if (!jwt.valid) return

  // Get all conventions created by this admin
  const conventions = (
    await firebase.firestore().collection('conventions').where('creator', '==', jwt.email).get()
  ).docs.reduce((acc: Convention[], doc) => [{ id: doc.id, ...doc.data() } as Convention, ...acc], [])

  res.status(200).send({ conventions })
}
