import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Security: Only allow in development - explicitly check for 'development'
  // If NODE_ENV is undefined, 'production', 'staging', or anything else, block access
  if (process.env.NODE_ENV !== 'development')
    return res.status(403).json({ error: 'Test endpoints only available in development' })

  const { election_id } = req.query
  if (!election_id || typeof election_id !== 'string') return res.status(400).json({ error: 'Missing election_id' })

  // Security: Only allow election IDs that start with "test-" to prevent affecting production elections
  if (!election_id.startsWith('test-')) return res.status(400).json({ error: 'Election ID must start with "test-"' })

  const doc = firebase.firestore().collection('elections').doc(election_id)

  // Delete all subcollections
  const subcollections = ['votes', 'votes-pending', 'votes-cached', 'voters', 'trustees', 'votes-rejected']
  for (const subcol of subcollections) {
    const snapshot = await doc.collection(subcol).get()
    const batch = firebase.firestore().batch()
    snapshot.docs.forEach((subDoc) => batch.delete(subDoc.ref))
    await batch.commit()
  }

  // Delete the election document
  await doc.delete()

  return res.status(200).json({ message: 'Election cleaned up successfully' })
}
