import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'
import { pusher } from '../../../pusher'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query
  const { body } = req
  const { email, trustee_auth } = body

  if (!email) {
    return res.status(404)
  }

  const electionDoc = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Is election_id in DB?
  const election = await electionDoc.get()
  if (!election.exists) {
    return res.status(400).end('Unknown Election ID.')
  }

  // Grab claimed trustee
  const trusteeDoc = electionDoc.collection('trustees').doc(email)
  const trustee = { ...(await trusteeDoc.get()).data() }

  // Authenticate by checking if trustee_auth token matches
  if (trustee.auth_token !== trustee_auth) {
    return res.status(401).end('Bad trustee_auth token')
  }

  // Remove email & trustee_auth from body obj
  delete body.email
  delete body.trustee_auth

  // Save whatever other new data they gave us
  await trusteeDoc.update({ ...body })

  // Notify all participants there's been an update
  pusher.trigger('keygen', 'update', `${email} updated`)

  res.status(201).end(`Updated ${email} object`)
}
