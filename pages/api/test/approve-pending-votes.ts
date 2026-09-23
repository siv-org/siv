import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../_services'
import { approvePendingVotes } from '../election/[election_id]/admin/approve-pending-vote'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Security: Only allow in development
  if (process.env.NODE_ENV !== 'development')
    return res.status(403).json({ error: 'Test endpoints only available in development' })

  const { election_id, link_auths } = req.body as { election_id?: string; link_auths?: string[] }
  if (!election_id) return res.status(400).json({ error: 'Missing election_id' })
  if (!election_id.startsWith('test-')) return res.status(400).json({ error: 'Election ID must start with "test-"' })
  if (!link_auths?.length) return res.status(400).json({ error: 'Missing link_auths' })

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  await approvePendingVotes(
    electionDoc,
    link_auths.map((link_auth) => ({ link_auth })),
  )

  return res.status(201).json({ message: 'Done' })
}
