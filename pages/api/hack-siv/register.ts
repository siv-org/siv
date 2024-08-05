// POST siv.org/api/hack-siv/register
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
    pushover('hacksiv/register: Invalid email submitted', email)
    return res.status(400).json({ error: 'Invalid email' })
  }

  // Store new record in db
  // Don't overwrite multiple submissions, just concat array. With timestamps
  // Store device useragent to compare HACK SIV participants to the population at large
  // Don't store IP addresses
  // Do store geoip country & state estimates for rough sense where people join from
  await firebase
    .firestore()
    .collection('hack-siv')
    .doc(email)
    .set(
      {
        last_seen_at: new Date(),
        registration: firestore.FieldValue.arrayUnion({
          created_at: new Date(),
          email,
          //   geoip: { county: 'FIXME', state: 'FIXME' },
          user_agent: req.headers['user-agent'],
        }),
      },
      { merge: true },
    )

  // Send welcome email
  await sendEmail({
    bcc: 'hack@siv.org',
    from: 'SIV',
    fromEmail: 'hack@siv.org',
    recipient: email,
    subject: 'Welcome to HACK SIV - TEST2',
    text: `<div style="text-align:center"><h2>Welcome to HACK SIV</h2>
Someone, hopefully you, just registered this email on <a href="https://hack.siv.org">hack.siv.org</a>.
<p style="opacity:0.5; font-style:italic;">Press REPLY if that sounds wrong.</p>`,
  })

  return res.status(201).json({ email, message: 'Sent verification' })
})
