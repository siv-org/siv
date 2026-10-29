import { firebase } from 'api/_services'
import Firebase from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { generateAuthToken } from 'src/crypto/generate-auth-tokens'
import { BALLOT_METHODS, sharedDemoElectionId } from 'src/demo/interactiveDemo/content'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Validate request method
  if (req.method !== 'POST') return res.setHeader('Allow', 'POST').status(405).json({ error: 'Use POST.' })
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body))
    return res.status(400).json({ error: 'Invalid demo request.' })

  // Validate requested ballot method
  const method = BALLOT_METHODS.find((item) => item.id === (req.body.method ?? 'plurality'))?.id
  if (!method) return res.status(400).json({ error: 'Unknown ballot method.' })

  // Mint auth token
  const db = firebase.firestore()
  const election = db.collection('elections').doc(sharedDemoElectionId(method))
  const auth = generateAuthToken()
  const registered: boolean = await db.runTransaction(async (transaction) => {
    // Keep the voter count and new voter record in sync if creation fails.
    // Lookup the election
    const data = (await transaction.get(election)).data()

    // Verify it's a demo, that is still open.
    if (data?.is_demo !== true || data.stop_accepting_votes) return false

    // Save the new auth token.
    // create() rejects the transaction on a code collision, from duplicate doc.IDs
    transaction.create(election.collection('voters').doc(auth), { auth_token: auth, created_at: new Date() })

    transaction.update(election, { num_voters: Firebase.firestore.FieldValue.increment(1) })

    return true // Success
  })
  if (!registered) return res.status(503).json({ error: 'The demo election is not available.' })

  // Return the new auth token
  return res.status(201).json({ auth })
}
