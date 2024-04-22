import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'

import { checkJwtOwnsConvention } from '../../validate-admin-jwt'
import { QR_Id } from './create-qrs'

export type ConventionSet = {
  convention_title: string
  qrs: QR_Id[]
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { convention_id, set } = req.query
  if (!convention_id || typeof convention_id !== 'string')
    return res.status(401).json({ error: `Missing convention_id` })

  // Confirm they created this convention
  const jwt = await checkJwtOwnsConvention(req, res, convention_id)
  if (!jwt.valid) return

  if (!set || typeof set !== 'string') return res.status(401).json({ error: `Missing set` })

  // Get all voters in this set
  const qrDocs = await firebase
    .firestore()
    .collection('conventions')
    .doc(convention_id)
    .collection('qr_ids')
    .where('setIndex', '==', Number(set))
    .get()

  const qrs = qrDocs.docs.map((d) => d.data())

  res.status(200).send({ convention_title: jwt.convention_title, qrs } as ConventionSet)
}
