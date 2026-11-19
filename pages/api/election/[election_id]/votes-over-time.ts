import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../_services'

/** Public-shaped demo: only submission times, no auth tokens or vote content. */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query
  if (!election_id || typeof election_id !== 'string') return res.status(400).json({ error: 'Missing election_id' })

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const election = await electionDoc.get()
  if (!election.exists) return res.status(400).json({ error: 'Unknown Election ID.' })

  const votes = await electionDoc.collection('votes').orderBy('created_at').get()
  const submitted_at = votes.docs
    .map((doc) => {
      const created_at = doc.data().created_at as
        | undefined
        | { _seconds?: number; seconds?: number; toMillis?: () => number }
      const ms = created_at?.toMillis?.() ?? (created_at?._seconds ?? created_at?.seconds ?? 0) * 1000
      return ms ? new Date(ms).toISOString() : null
    })
    .filter((t): t is string => !!t)

  return res.status(200).json({
    election_title: election.data()?.election_title ?? null,
    submitted_at,
  })
}
