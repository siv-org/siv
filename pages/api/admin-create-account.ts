import { validate as validateEmail } from 'email-validator'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover, sendEmail } from './_services'
import { generateEmailLoginCode } from './admin-login'

const trimString = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body: {
    application_intent?: 'exploring' | 'upcoming_election'
    election_date?: string
    election_num_voters?: string
    election_type?: string
    email?: string
    first_name?: string
    last_name?: string
    your_organization?: string
  } = req.body

  const email = trimString(body.email).toLowerCase()

  // Confirm they sent a valid email address (only required field)
  if (!email) return res.status(400).send({ error: 'Missing email' })
  if (!validateEmail(email)) return res.status(400).send({ error: 'Invalid email' })

  // Stop if they already have an account
  const adminDoc = firebase.firestore().collection('admins').doc(email)
  if ((await adminDoc.get()).exists)
    return res.status(409).send({ error: `'${email}' already has an account.\n\nLog in above.` })

  const first_name = trimString(body.first_name)
  const last_name = trimString(body.last_name)
  const organization = trimString(body.your_organization)

  const election_type = trimString(body.election_type)
  const election_date = trimString(body.election_date)
  const election_num_voters = trimString(body.election_num_voters)

  const init_login_code = generateEmailLoginCode()

  // Store their application in the DB
  const doc_id = new Date().toISOString() + '-' + String(Math.random()).slice(2, 7)
  await Promise.all([
    firebase.firestore().collection('applied-admins').doc(doc_id).create({
      application_intent: body.application_intent,
      created_at: new Date(),
      election_date,
      election_num_voters,
      election_type,
      email,
      first_name,
      init_login_code,
      last_name,
      organization,
    }),

    // Remove their draft application if it exists
    firebase
      .firestore()
      .collection('applied-admins-drafts')
      .doc(email)
      .delete()
      .catch(() => {}),
  ])

  const blank = (s: string) => (s ? s : '—')
  // Send message w/ Approval Link
  const message = `New SIV Admin Application

First Name: ${blank(first_name)}
Last Name: ${blank(last_name)}
Email: ${email}
Organization: ${blank(organization)}

Intent: ${body.application_intent}

${
  body.application_intent === 'exploring'
    ? ''
    : `Election type: ${blank(election_type)}
Election date: ${blank(election_date)}
Election number of voters: ${blank(election_num_voters)}`
}

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

  return res.status(200).send({ init_login_code, message: 'Success' })
}
