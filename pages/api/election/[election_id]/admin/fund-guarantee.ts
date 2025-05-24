import { firebase } from 'api/_services'
import { pushover } from 'api/_services'
import { checkJwtOwnsElection } from 'api/validate-admin-jwt'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { amount } = req.body
  const { election_id } = req.query

  if (typeof election_id !== 'string') return res.status(401).json({ error: 'Missing election_id' })

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  // Validate amount
  const numAmount = typeof amount === 'string' ? Number(amount) : amount
  if (!numAmount || isNaN(numAmount) || numAmount <= 0) return res.status(400).json({ error: 'Invalid amount' })

  // Store the pledge in a subcollection
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  await electionDoc.collection('guarantee_pledges').add({
    amount: numAmount,
    pledged_at: new Date(),
  })

  await pushover(
    'New financial guarantee pledge',
    `Admin ${jwt.email} pledged $${numAmount} to support vote integrity.

Election:
${election_id}: ${jwt.election_title}`,
  )

  return res.status(201).json({ amount: numAmount, success: true })
}
