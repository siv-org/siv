import { validate as validateEmail } from 'email-validator'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover, sendEmail } from './_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    email,
    first_name,
    last_name,
    your_organization,
  }: { email?: string; first_name?: string; last_name?: string; your_organization?: string } = req.body

  console.log('In create account route')

  // Confirm they sent a valid email address
  if (!email) return res.status(400).send({ error: 'Missing email' })
  if (!validateEmail(email)) return res.status(400).send({ error: 'Invalid email' })

  // Stop if they already have an account
  const adminDoc = firebase.firestore().collection('admins').doc(email.toLowerCase())
  if ((await adminDoc.get()).exists)
    return res.status(409).send({ error: `'${email}' already has an account.\n\nLog in above.` })

  // Store their application in the DB
  const doc_id = new Date().toISOString() + ' ' + String(Math.random()).slice(2, 7)
  firebase
    .firestore()
    .collection('applied-admins')
    .doc(doc_id)
    .create({ created_at: new Date(), ...req.body })

  // Send message w/ Approval Link
  const message = `New SIV Admin Application

First Name: ${first_name}
Last Name: ${last_name}
Email: ${email}
Organization: ${your_organization}

Link to approve: ${req.headers.origin}/approve-admin?email=${email}`

  await Promise.all([
    sendEmail({
      from: `${email}`,
      recipient: 'applied-admin@secureinternetvoting.org',
      subject: 'SIV Admin Application',
      text: message,
    }),
    pushover(`new admin: ${email}`, message),
  ])

  res.status(200).send('Success')
}
