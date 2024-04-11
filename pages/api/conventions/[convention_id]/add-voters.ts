import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../_services'
import { checkJwtOwnsConvention } from '../../validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { convention_id } = req.query
  if (!convention_id || typeof convention_id !== 'string')
    return res.status(401).json({ error: `Missing convention_id` })

  const { numVoters } = req.body
  if (!numVoters || typeof numVoters !== 'number') return res.status(401).json({ error: `Missing numVoters` })

  // Confirm they created this convention
  const jwt = await checkJwtOwnsConvention(req, res, convention_id)
  if (!jwt.valid) return

  await firebase
    .firestore()
    .collection('conventions')
    .doc(convention_id)
    .update({
      num_voters: firestore.FieldValue.increment(numVoters),
      voters: firestore.FieldValue.arrayUnion({ createdAt: new Date(), number: numVoters }),
    })

  return res.status(201).send({ success: true })
}
