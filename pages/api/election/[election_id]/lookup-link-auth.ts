// Temporary recovery helper for incomplete link-auth registration (Jul 2026).

import { firebase } from 'api/_services'
import { isEqual } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { election_id } = req.query as { election_id: string }
  // Whitelisted elections only — encrypted votes are public on the status page.
  const ALLOWED_ELECTIONS = new Set(['1783637746011', '1783994820958']) // CCN + test
  if (!ALLOWED_ELECTIONS.has(election_id)) return res.status(403).json({ error: 'Not available for this election' })

  // Validate request body
  const { encrypted_vote, link_auth } = req.body || {}
  if (!link_auth && !encrypted_vote) return res.status(400).json({ error: 'link_auth or encrypted_vote required' })

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  // If they provided a link_auth, use to look up the vote auth status
  if (typeof link_auth === 'string' && link_auth) {
    const pending = await electionDoc.collection('votes-pending').doc(link_auth).get()
    if (!pending.exists) return res.status(404).json({ error: 'Vote not found' })
    return res.status(200).json({ link_auth, needs_auth: !pending.data()?.auth_added_at })
  }

  // Otherwise, use encrypted vote to look it up
  const pendingSnap = await electionDoc.collection('votes-pending').get()
  const match = pendingSnap.docs.find((d) => isEqual(d.data()?.encrypted_vote, encrypted_vote))
  if (!match) return res.status(404).json({ error: 'Vote not found' })

  return res.status(200).json({
    link_auth: match.data()?.link_auth || match.id,
    needs_auth: !match.data()?.auth_added_at,
  })
}
