import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from './_services'
import { checkJwt } from './validate-admin-jwt'

/** Aggregation read only — for dashboard header before loading the full elections list. */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Confirm they're a valid admin
  const jwt = checkJwt(req, res)
  if (!jwt.valid) return

  const docs = (await firebase.firestore().collection('elections').where('creator', '==', jwt.email).get()).docs
  const election_count = docs.filter((d) => !d.data().archived_at).length
  const archived_count = docs.length - election_count

  return res.status(200).send({ archived_count, election_count })
}
