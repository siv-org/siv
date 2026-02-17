// POST siv.org/api/fvxp/register
// req.body { email: string }

import { allowCors } from 'api/_cors'
import { firebase, pushover, sendEmail } from 'api/_services'
import { validate } from 'email-validator'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

export default allowCors(async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body
  if (!email || typeof email !== 'string') res.status(400).json({ error: '`email` is required' })

  const headers = ['x-vercel-ip-city', 'x-vercel-ip-country-region', 'x-vercel-ip-country']
  const location = headers.map((header) => req.headers[header]?.toString().replaceAll('%20', ' ')).join(', ')

  // Validate that it is a valid email
  if (!validate(email)) {
    pushover('fvxp/register: Invalid email submitted', `email\n${location}\n${req.headers['x-real-ip']}`)
    return res.status(400).json({ error: 'Invalid email' })
  }

  // Store new record in db
  await firebase
    .firestore()
    .collection('fvxp26')
    .doc(email)
    .set(
      {
        last_seen_at: new Date(),
        registration: firestore.FieldValue.arrayUnion({
          created_at: new Date(),
          email,
          geoip: { city: req.headers['x-vercel-ip-city'], country: req.headers['x-vercel-ip-country'], region: req.headers['x-vercel-ip-country-region'] },
          ip: req.headers['x-real-ip'],
          user_agent: req.headers['user-agent'],
        }),
      },
      { merge: true },
    )

  // Send registration email
  await sendEmail({
    from: 'SIV',
    fromEmail: 'fvxp@siv.org',
    recipient: 'fvxp@siv.org',
    subject: 'FVXP Registration',
    text: `<div style="text-align:center"><h2>FVXP Registration</h2>
Someone just registered this email: ${email}

From: ${location}</div>`,
  })

  return res.status(201).json({ success: true })
})
