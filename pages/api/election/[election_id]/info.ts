import { NextApiRequest, NextApiResponse } from 'next'

import { Item } from '../../../../src/vote/storeElectionInfo'
import { firebase } from '../../_services'

export type ElectionInfo = {
  ballot_design?: Item[]
  election_title?: string
  esignature_requested?: boolean
  g?: string
  has_decrypted_votes?: boolean
  last_decrypted_at?: Date
  p?: string
  threshold_public_key?: string
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query

  const data = (
    await firebase
      .firestore()
      .collection('elections')
      .doc(election_id as string)
      .get()
  ).data()

  // Is election_id in DB?
  if (!data) return res.status(400).json({ error: 'Unknown Election ID.' })

  const { ballot_design, election_title, esignature_requested, g, last_decrypted_at, p, threshold_public_key } = data

  const info: ElectionInfo = {
    ballot_design: ballot_design ? JSON.parse(ballot_design) : undefined,
    election_title,
    esignature_requested,
    g,
    has_decrypted_votes: !!last_decrypted_at,
    last_decrypted_at: last_decrypted_at ? new Date(last_decrypted_at._seconds * 1000) : undefined,
    p,
    threshold_public_key,
  }

  // Return public election fields
  res.status(200).json(info)
}
