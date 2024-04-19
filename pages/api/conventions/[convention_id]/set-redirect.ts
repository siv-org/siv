import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../_services'
import { checkJwtOwnsConvention } from '../../validate-admin-jwt'
import { createBallotAuthsForQrs } from './create-ballot-auths-for-qrs'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { convention_id } = req.query
  if (!convention_id || typeof convention_id !== 'string')
    return res.status(401).json({ error: `Missing convention_id` })

  const { election_id } = req.body
  if (!election_id || typeof election_id !== 'string') return res.status(401).json({ error: `Missing election_id` })

  // Confirm they created this convention
  const jwt = await checkJwtOwnsConvention(req, res, convention_id)
  if (!jwt.valid) return

  const conventionDoc = firebase.firestore().collection('conventions').doc(convention_id)
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  // Confirm they own the election
  const election = { ...(await electionDoc.get()).data() }
  if (election.creator !== jwt.email)
    return res.status(401).send({ error: `This user did not create election ${election_id}` })

  // Save redirect in DB
  const updateConventionDoc = conventionDoc.update({ active_redirect: election_id })

  // Create new ballot auth tokens for each QR
  await createBallotAuthsForQrs(convention_id, election_id)

  await updateConventionDoc

  return res.status(201).send({ success: true })
}
