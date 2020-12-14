import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'
import { pusher } from '../../../pusher'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query
  const { commitments, email, trustee_auth } = req.body

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

  // Save the new commitments they gave us
  await trusteeDoc.update({ commitments })

  // Notify all participants there's been an update
  pusher.trigger('keygen', 'update', 'New commitments added')

  res.status(201).end(`Set ${email} commitments to ${commitments}`)
}
