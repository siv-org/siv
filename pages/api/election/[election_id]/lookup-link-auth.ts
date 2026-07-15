// Temporary recovery helper for incomplete link-auth registration (Jul 2026).

import { firebase, pushover } from 'api/_services'
import { isEqual } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'
import { LINK_AUTH_RECOVERY_ELECTIONS } from 'src/vote/submitted/decideMissingAuth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { election_id } = req.query as { election_id: string }
  // Whitelisted elections only — encrypted votes are public on the status page.
  if (!LINK_AUTH_RECOVERY_ELECTIONS.has(election_id))
    return res.status(403).json({ error: 'Not available for this election' })

  // Validate request body
  const { encrypted_vote, link_auth } = req.body || {}
  if (!link_auth && !encrypted_vote) return res.status(400).json({ error: 'link_auth or encrypted_vote required' })

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const ip = String(req.headers['x-real-ip'] || '?')

  // If they provided a link_auth, use to look up the vote auth status
  if (typeof link_auth === 'string' && link_auth) {
    const pending = await electionDoc.collection('votes-pending').doc(link_auth).get()
    if (!pending.exists) {
      await pushover(
        'lookup-link-auth: miss',
        `election: ${election_id}\nvia: link_auth\nlink_auth: ${link_auth}\nIP: ${ip}`,
      )
      return res.status(404).json({ error: 'Vote not found' })
    }
    const needs_auth = !pending.data()?.auth_added_at
    await pushover(
      'lookup-link-auth: found',
      `election: ${election_id}\nvia: link_auth\nlink_auth: ${link_auth}\nneeds_auth: ${needs_auth}\nIP: ${ip}`,
    )
    return res.status(200).json({ link_auth, needs_auth })
  }

  // Otherwise, use encrypted vote to look it up
  const pendingSnap = await electionDoc.collection('votes-pending').get()
  const match = pendingSnap.docs.find((d) => isEqual(d.data()?.encrypted_vote, encrypted_vote))
  if (!match) {
    await pushover(
      'lookup-link-auth: miss',
      `election: ${election_id}\nvia: ciphertext\nIP: ${ip}`,
    )
    return res.status(404).json({ error: 'Vote not found' })
  }

  const resolved = match.data()?.link_auth || match.id
  const needs_auth = !match.data()?.auth_added_at
  await pushover(
    'lookup-link-auth: found',
    `election: ${election_id}\nvia: ciphertext\nlink_auth: ${resolved}\nneeds_auth: ${needs_auth}\nIP: ${ip}`,
  )
  return res.status(200).json({ link_auth: resolved, needs_auth })
}
