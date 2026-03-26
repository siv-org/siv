import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from './_services'
import { checkJwt } from './validate-admin-jwt'

/** Aggregation read only — for dashboard header before loading the full elections list. */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Confirm they're a valid admin
  const jwt = checkJwt(req, res)
  if (!jwt.valid) return

  const election_count = (
    await firebase.firestore().collection('elections').where('creator', '==', jwt.email).count().get()
  ).data().count

  return res.status(200).send({ election_count })
}
