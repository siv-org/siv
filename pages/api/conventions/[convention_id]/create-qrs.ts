import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { generateAuthToken } from 'src/crypto/generate-auth-tokens'

import { firebase } from '../../_services'
import { checkJwtOwnsConvention } from '../../validate-admin-jwt'

export type QR_Id = {
  ballot_auths?: { [ballot_id: string]: string }
  createdAt: Date
  index: number
  qr_id: string
  setIndex: number
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { convention_id } = req.query
  if (!convention_id || typeof convention_id !== 'string')
    return res.status(401).json({ error: `Missing convention_id` })

  const { numQRs } = req.body
  if (!numQRs || typeof numQRs !== 'number') return res.status(401).json({ error: `Missing numQRs` })

  // Confirm they created this convention
  const jwt = await checkJwtOwnsConvention(req, res, convention_id)
  if (!jwt.valid) return

  const doc = firebase.firestore().collection('conventions').doc(convention_id)

  const createdAt = new Date()

  // Insert new voters in DB
  const updateConventionDoc = doc.update({
    num_qrs: firestore.FieldValue.increment(numQRs),
    qrs: firestore.FieldValue.arrayUnion({ createdAt, number: numQRs }),
  })

  const { num_qrs: prev_num_qrs = 0 } = jwt
  const newSetIndex = jwt.qrs?.length || 0

  // Assign unique qr_ids
  const createNewQrIds = Array.from({ length: numQRs }, () => generateAuthToken()).map((qr_id, i) =>
    doc
      .collection('qr_ids')
      .doc(qr_id)
      .set({
        createdAt,
        index: i + prev_num_qrs + 1,
        qr_id,
        setIndex: newSetIndex,
      } as QR_Id),
  )

  await Promise.all(createNewQrIds)
  await updateConventionDoc

  return res.status(201).send({ success: true })
}
