import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }
  const { custom_invitation_subject } = req.body

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  // Update the custom invitation text in the database
  await firebase.firestore().collection('elections').doc(election_id).update({
    custom_invitation_subject,
  })

  res.status(200).json({ message: 'Custom invitation subject updated' })
}
