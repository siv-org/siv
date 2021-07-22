import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  const electionDoc = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // TODO: fix me?
  await Promise.all((await electionDoc.collection('trustees').get()).docs.map((doc) => doc /*.delete */))

  res.status(204).send('Reset success')
}
