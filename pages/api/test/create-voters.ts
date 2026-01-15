import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Security: Only allow in development
  if (process.env.NODE_ENV !== 'development')
    return res.status(403).json({ error: 'Test endpoints only available in development' })

  const { election_id, voters } = req.body as {
    election_id: string
    voters: Array<{ auth_token: string; email?: string }>
  }
  if (!voters || !Array.isArray(voters)) return res.status(400).json({ error: 'Missing voters array' })

  if (!election_id) return res.status(400).json({ error: 'Missing election_id' })
  // Security: Only allow election IDs that start with "test-"
  if (!election_id.startsWith('test-')) return res.status(400).json({ error: 'Election ID must start with "test-"' })

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  // Create voters with specified auth tokens
  const batch = firebase.firestore().batch()
  for (const voter of voters) {
    if (!voter.auth_token) return res.status(400).json({ error: 'Each voter must have an auth_token' })

    const email = voter.email || `${voter.auth_token}@test.local`
    const voterRef = electionDoc.collection('voters').doc(email)

    batch.set(voterRef, {
      added_at: firestore.FieldValue.serverTimestamp(),
      auth_token: voter.auth_token,
      email,
    })
  }

  // Update election's voter count
  batch.update(electionDoc, {
    num_voters: firestore.FieldValue.increment(voters.length),
  })

  await batch.commit()

  return res.status(201).json({ message: `Created ${voters.length} voters`, voters: voters.length })
}
