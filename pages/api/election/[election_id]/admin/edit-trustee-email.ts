import { validate as validateEmail } from 'email-validator'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'
import { generateAuthToken } from '../../../invite-voters'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'
import { sendTrusteeInvite } from './add-trustees'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { new_email, old_email } = req.body
  if (new_email === old_email) return res.status(401).json({ error: 'new_email must be different from old_email' })

  const { election_id } = req.query as { election_id: string }

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  const { election_manager, election_title } = jwt

  const trusteesCollection = firebase.firestore().collection('elections').doc(election_id).collection('trustees')

  // Get old trustee data
  const old_trustee_doc = await trusteesCollection.doc(old_email).get()
  if (!old_trustee_doc.exists) return res.status(401).json({ error: `Can't find trustee ${old_email}` })
  const old_trustee_data = { ...old_trustee_doc.data() }
  old_trustee_data.email = new_email

  // Only allow editing if they haven't opened their link yet
  if (old_trustee_data.recipient_key)
    return res
      .status(401)
      .json({ error: `Can't edit: ${old_email}. They already opened their invitation. You can create a new election.` })

  // Confirm new trustee doesn't already exist
  if ((await trusteesCollection.doc(new_email).get()).exists)
    return res.status(401).json({ error: `There's already an Observer ${new_email}` })

  // Validate new_email is a valid email address
  if (!validateEmail(new_email)) return res.status(401).json({ error: `Invalid email: ${new_email}` })

  // Store record of edit on new trustee
  old_trustee_data.email_edits = [
    ...(old_trustee_data.email_edits || []),
    { auth_token: old_trustee_data.auth_token, edited_at: new Date(), email: old_email },
  ]

  // Give the trustee a new auth token
  const new_auth_token = generateAuthToken()
  old_trustee_data.auth_token = new_auth_token

  // Delete the old trustee and move its data to new_email
  await Promise.all([
    trusteesCollection.doc(old_email).delete(),
    trusteesCollection.doc(new_email).set(old_trustee_data),
  ])

  // Send trustee invite email to new_email
  const link = `${req.headers.origin}/election/${election_id}/trustee?auth=${new_auth_token}`
  await sendTrusteeInvite({
    election_id,
    election_manager,
    election_title,
    email: new_email,
    link,
    name: old_trustee_data.name,
  })

  return res.status(201).json({ message: 'Changed email' })
}
