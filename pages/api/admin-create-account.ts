import { validate as validateEmail } from 'email-validator'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover, sendEmail } from './_services'
import { generateEmailLoginCode } from './admin-login'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let { email } = req.body
  const {
    application_intent,
    election_date,
    election_num_voters,
    election_type,
    first_name,
    last_name,
    your_organization,
  }: {
    application_intent?: 'exploring' | 'upcoming_election'
    election_date?: string
    election_num_voters?: string
    election_type?: string
    email?: string
    first_name?: string
    last_name?: string
    your_organization?: string
  } = req.body

  // Confirm they sent a valid email address (only required field)
  if (!email) return res.status(400).send({ error: 'Missing email' })
  if (!validateEmail(email)) return res.status(400).send({ error: 'Invalid email' })
  email = email.toLowerCase()

  const first = typeof first_name === 'string' ? first_name.trim() : ''
  const last = typeof last_name === 'string' ? last_name.trim() : ''
  const org = typeof your_organization === 'string' ? your_organization.trim() : ''
  const et = typeof election_type === 'string' ? election_type.trim() : ''
  const ed = typeof election_date === 'string' ? election_date.trim() : ''
  const env = typeof election_num_voters === 'string' ? election_num_voters.trim() : ''

  const intent: 'exploring' | 'upcoming_election' =
    application_intent === 'exploring' ? 'exploring' : 'upcoming_election'
  const intentLine =
    intent === 'exploring'
      ? 'Exploring SIV (no upcoming election details)'
      : 'Upcoming election (details below as provided)'

  // Stop if they already have an account
  const adminDoc = firebase.firestore().collection('admins').doc(email)
  if ((await adminDoc.get()).exists)
    return res.status(409).send({ error: `'${email}' already has an account.\n\nLog in above.` })

  const init_login_code = generateEmailLoginCode()

  // Store their application in the DB
  const doc_id = new Date().toISOString() + '-' + String(Math.random()).slice(2, 7)
  firebase
    .firestore()
    .collection('applied-admins')
    .doc(doc_id)
    .create({
      created_at: new Date(),
      ...req.body,
      application_intent: intent,
      election_date: ed,
      election_num_voters: env,
      election_type: et,
      email,
      first_name: first,
      init_login_code,
      last_name: last,
      your_organization: org,
    })

  firebase.firestore().collection('applied-admins-drafts').doc(email).delete().catch(() => {})

  const blank = (s: string) => (s ? s : '—')

  // Send message w/ Approval Link
  const message = `New SIV Admin Application

First Name: ${blank(first)}
Last Name: ${blank(last)}
Email: ${email}
Organization: ${blank(org)}

Intent: ${intentLine}

Election details — type: ${blank(et)}
Election details — date: ${blank(ed)}
Election details — number of voters: ${blank(env)}

Link to approve: ${req.headers.origin}/approve-admin?id=${doc_id}

Approve & skip email verification: ${req.headers.origin}/approve-admin?id=${doc_id}&skip_init_email_validation=true
(The device that submitted the admin application will be logged in)`

  await Promise.all([
    sendEmail({
      recipient: process.env.ADMIN_EMAIL as string,
      subject: `SIV Admin Application: ${email}`,
      text: message,
    }),
    pushover(`new admin: ${email}`, message),
  ])

  res.status(200).send({ init_login_code, message: 'Success' })
}
