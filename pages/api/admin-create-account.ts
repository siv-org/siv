import { validate as validateEmail } from 'email-validator'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover, sendEmail } from './_services'
import { generateAdminLoginCode } from './admin-login'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    email,
    first_name,
    last_name,
    your_organization,
  }: { email?: string; first_name?: string; last_name?: string; your_organization?: string } = req.body

  // Confirm they sent a valid email address
  if (!email) return res.status(400).send({ error: 'Missing email' })
  if (!validateEmail(email)) return res.status(400).send({ error: 'Invalid email' })

  // Stop if they already have an account
  const adminDoc = firebase.firestore().collection('admins').doc(email.toLowerCase())
  if ((await adminDoc.get()).exists)
    return res.status(409).send({ error: `'${email}' already has an account.\n\nLog in above.` })

  const init_login_code = generateAdminLoginCode()

  // Store their application in the DB
  const doc_id = new Date().toISOString() + '-' + String(Math.random()).slice(2, 7)
  firebase
    .firestore()
    .collection('applied-admins')
    .doc(doc_id)
    .create({ created_at: new Date(), ...req.body, init_login_code })

  // Send message w/ Approval Link
  const message = `New SIV Admin Application

First Name: ${first_name}
Last Name: ${last_name}
Email: ${email}
Organization: ${your_organization}

Link to approve: ${req.headers.origin}/approve-admin?id=${doc_id}

Approve & skip email verification: ${req.headers.origin}/approve-admin?id=${doc_id}&skip_init_email_validation=true`

  await Promise.all([
    sendEmail({
      recipient: 'applied-admin@siv.org',
      subject: `SIV Admin Application: ${email}`,
      text: message,
    }),
    pushover(`new admin: ${email}`, message),
  ])

  res.status(200).send({ init_login_code, message: 'Success' })
}
