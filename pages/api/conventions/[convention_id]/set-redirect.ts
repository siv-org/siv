import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../_services'
import { checkJwtOwnsConvention } from '../../validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { convention_id } = req.query
  if (!convention_id || typeof convention_id !== 'string')
    return res.status(401).json({ error: `Missing convention_id` })

  const { election_id } = req.body
  if (!election_id || typeof election_id !== 'string') return res.status(401).json({ error: `Missing election_id` })

  // Confirm they created this convention
  const jwt = await checkJwtOwnsConvention(req, res, convention_id)
  if (!jwt.valid) return

  // TODO: Confirm they own the election

  const doc = firebase.firestore().collection('conventions').doc(convention_id)

  // Save redirect in DB
  const updateConventionDoc = doc.update({ active_redirect: election_id })

  await updateConventionDoc

  return res.status(201).send({ success: true })
}
