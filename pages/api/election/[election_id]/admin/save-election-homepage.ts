import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_homepage } = req.body
  const { election_id } = req.query as { election_id: string }

  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  await firebase.firestore().collection('elections').doc(election_id).update({ election_homepage })

  return res.status(201).json({ message: 'Saved election homepage' })
}
