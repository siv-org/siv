import { NextApiRequest, NextApiResponse } from 'next'

import { allowCors } from '../_cors'
import { firebase } from '../_services'

export default allowCors(async (req: NextApiRequest, res: NextApiResponse) => {
  const { limit, url } = req.query as { limit?: string; url?: string }

  if (!url) return res.status(400).json({ error: 'Missing url parameter.' })

  let query = firebase.firestore().collection('elections').where('election_homepage', '==', url)
  if (limit) query = query.limit(+limit)

  const matches = await query.get()
  if (matches.empty) return res.status(200).json([])

  const results = matches.docs.map((electionDoc) => {
    const {
      ballot_design_finalized,
      election_title,
      last_decrypted_at,
      num_voters,
      num_votes,
      stop_accepting_votes,
    } = electionDoc.data()

    return {
      ballot_design_finalized,
      election_id: electionDoc.id,
      election_title,
      has_decrypted_votes: !!last_decrypted_at,
      last_decrypted_at: last_decrypted_at ? new Date(last_decrypted_at._seconds * 1000) : undefined,
      num_voters,
      num_votes,
      stop_accepting_votes,
    }
  })

  res.status(200).json(results)
})
