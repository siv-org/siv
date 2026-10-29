import { firebase } from 'api/_services'
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
  const voterNumber = await db.runTransaction(async (transaction) => {
    // Use a transaction to avoid num_voters getting out-of-sync from auth token collisions

    // Lookup the election
    const data = (await transaction.get(election)).data()

    // Verify it's a demo, that is still open.
    if (data?.is_demo !== true || data.stop_accepting_votes) return null

    // Assign a stable registration number within this demo election, not a count of votes cast.
    // Keep it in the transaction so simultaneous registrations receive different numbers.
    const voterNumber = (Number(data.num_voters) || 0) + 1

    // Save the new auth token.
    // create() rejects the transaction on a code collision, from duplicate doc.IDs
    transaction.create(election.collection('voters').doc(auth), {
      auth_token: auth,
      created_at: new Date(),
      voterNumber,
    })

    transaction.update(election, { num_voters: voterNumber })

    return voterNumber // Success
  })
  if (voterNumber === null) return res.status(503).json({ error: 'The demo election is not available.' })

  // Return the new auth token and its registration number
  return res.status(201).json({ auth, voterNumber })
}
