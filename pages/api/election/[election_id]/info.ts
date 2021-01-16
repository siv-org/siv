import { NextApiRequest, NextApiResponse } from 'next'

import { pick } from '../../../../src/utils'
import { firebase } from '../../_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query

  const election = (
    await firebase
      .firestore()
      .collection('elections')
      .doc(election_id as string)
      .get()
  ).data()

  // Is election_id in DB?
  if (!election) return res.status(400).json({ error: 'Unknown Election ID.' })

  // Return public election fields
  res
    .status(200)
    .json(pick(election, ['ballot_design', 'g', 'p', 'threshold_public_key', 'last_decrypted_at', 'election_title']))
}
