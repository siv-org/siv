import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query

  if (typeof election_id !== 'string') return res.status(400).json({ error: 'election_id is required' })

  if (keepDecryptedPrivate.includes(election_id)) return res.status(400).json([])

  const election = await firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)
    .get()

  // Is election_id in DB?
  if (!election.exists) return res.status(400).end('Unknown Election ID.')

  res.status(200).json(election.data()?.decrypted || [])
}

// To begin decrypting in batches, without leaking results early
import { live11chooses } from 'src/vote/YourAuthToken'

const keepDecryptedPrivate = [live11chooses]
