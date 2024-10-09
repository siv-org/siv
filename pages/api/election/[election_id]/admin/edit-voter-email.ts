import { firebase } from 'api/_services'
import { checkJwtOwnsElection } from 'api/validate-admin-jwt'
import { validate as validateEmail } from 'email-validator'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { auth_token, new_email } = req.body

  const { election_id } = req.query as { election_id: string }

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  const votersCollection = firebase.firestore().collection('elections').doc(election_id).collection('approved-voters')

  // Confirm new voter doesn't already exist
  if ((await votersCollection.where('email', '==', new_email).get()).docs.length > 0)
    return res.status(401).json({ error: `There's already a voter ${new_email}` })

  // Validate new_email is a valid email address
  if (!validateEmail(new_email)) return res.status(401).json({ error: `Invalid email: ${new_email}` })

  // Get old voter data
  const voterDoc = votersCollection.doc(auth_token)
  const voter = await voterDoc.get()
  if (!voter.exists) return res.status(401).json({ error: `Can't find voter: ${auth_token}` })
  const voter_data = voter.data()
  const old_email = voter_data?.email
  const email_edits = [...(voter_data?.email_edits || []), { edited_at: new Date(), old_email }]

  // Store record of edit
  await voterDoc.update({ email: new_email, email_edits })

  return res.status(201).json({ message: 'Changed email' })
}
