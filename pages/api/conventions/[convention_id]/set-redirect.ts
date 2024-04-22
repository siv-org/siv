import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../_services'
import { checkJwtOwnsConvention } from '../../validate-admin-jwt'
import { ensureBallotAuthsForQrs } from './ensure-ballot-auths-for-qrs'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { convention_id } = req.query
  if (typeof convention_id !== 'string') return res.status(401).json({ error: `Missing convention_id` })

  const { election_id } = req.body
  if (typeof election_id !== 'string') return res.status(401).json({ error: `Missing election_id` })

  // Confirm they created this convention
  const jwt = await checkJwtOwnsConvention(req, res, convention_id)
  if (!jwt.valid) return

  const conventionDoc = firebase.firestore().collection('conventions').doc(convention_id)

  // If they're not removing the redirect...
  if (election_id !== '') {
    // Confirm they own the election
    const election = { ...(await firebase.firestore().collection('elections').doc(election_id).get()).data() }
    if (election.creator !== jwt.email)
      return res.status(401).send({ error: `This user did not create election ${election_id}` })

    await ensureBallotAuthsForQrs(convention_id, election_id)
  }

  // Save redirect in DB
  await conventionDoc.update({ active_redirect: election_id })

  return res.status(201).send({ success: true })
}
