// POST siv.org/api/11-chooses/register
// req.body { email: string }

import { allowCors } from 'api/_cors'
import { firebase, pushover, sendEmail } from 'api/_services'
import { validate } from 'email-validator'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

export default allowCors(async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body
  if (!email || typeof email !== 'string') res.status(400).json({ error: '`email` is required' })

  // Validate that it is a valid email
  if (!validate(email)) {
    pushover('11chooses/register: Invalid email submitted', email)
    return res.status(400).json({ error: 'Invalid email' })
  }

  // Store new record in db
  // Don't overwrite multiple submissions, just concat array. With timestamps
  // Store device useragent to compare 11chooses participants to the population at large
  // Don't store IP addresses
  // Do store geoip country & state estimates for rough sense where people join from
  await firebase
    .firestore()
    .collection('11chooses')
    .doc(email)
    .set(
      {
        last_seen_at: new Date(),
        registration: firestore.FieldValue.arrayUnion({
          created_at: new Date(),
          email,
          geoip: { country: req.headers['x-vercel-ip-country'], region: req.headers['x-vercel-ip-country-region'] },
          user_agent: req.headers['user-agent'],
        }),
      },
      { merge: true },
    )

  // Send welcome email
  await sendEmail({
    bcc: '11chooses@siv.org',
    from: 'SIV',
    fromEmail: '11chooses@siv.org',
    recipient: email,
    subject: 'Welcome to 11 Chooses',
    text: `<div style="text-align:center"><h2>Welcome to 11 Chooses</h2>
Someone, hopefully you, just registered this email on <a href="https://11chooses.siv.org">11chooses.siv.org</a>.
<p style="opacity:0.5; font-style:italic;">Press REPLY if that sounds wrong.</p>`,
  })

  return res.status(201).json({ email, message: 'Sent verification' })
})
