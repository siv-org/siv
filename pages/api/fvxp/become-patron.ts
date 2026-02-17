// POST siv.org/api/fvxp/become-patron
// req.body { type: 'individual' | 'organization', name: string, uid?: string, contribution?: string, email?: string }

import { allowCors } from 'api/_cors'
import { firebase, pushover, sendEmail } from 'api/_services'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

export default allowCors(async (req: NextApiRequest, res: NextApiResponse) => {
  const randomId = Math.random()
    .toString(36)
    .substring(2, 2 + 8) // 8 base-36 digits, ~2.8 trillion possible

  const { contribution, email, name, type, uid = randomId } = req.body

  const headers = ['x-vercel-ip-city', 'x-vercel-ip-country-region', 'x-vercel-ip-country']
  const missingHeaders = !headers.every((header) => req.headers[header])
  const location = missingHeaders
    ? ''
    : headers.map((header) => req.headers[header]?.toString().replaceAll('%20', ' ')).join(', ')

  // Ping admin
  pushover(
    `fvxp/patron [${uid}]`,
    `type: ${type}
name: ${name}${contribution ? `\ncontribution: ${contribution}` : ''}${email ? `\nemail: ${email}` : ''}
${location} (${req.headers['x-real-ip'] || 'LOCALHOST'})`,
  )

  // Store new record in db
  await firebase
    .firestore()
    .collection('fvxp26-patrons')
    .doc(uid)
    .set(
      {
        ...(contribution ? { contribution } : {}),
        ...(email ? { email } : {}),
        last_seen_at: new Date(),
        name,
        submissions: firestore.FieldValue.arrayUnion({
          ...(contribution ? { contribution } : {}),
          created_at: new Date(),
          ...(email ? { email } : {}),
          geoip: {
            city: req.headers['x-vercel-ip-city'] || '',
            country: req.headers['x-vercel-ip-country'] || '',
            region: req.headers['x-vercel-ip-country-region'] || '',
          },
          ip: req.headers['x-real-ip'] || '',
          name,
          type,
          user_agent: req.headers['user-agent'],
        }),
        type,
      },
      { merge: true },
    )

  // Email notif on completion
  if (email) {
    await sendEmail({
      from: 'SIV',
      fromEmail: 'fvxp@siv.org',
      recipient: 'fvxp-admin@siv.org',
      subject: 'FVXP Patron Submission: ' + email,
      text: `<div style="text-align:center"><h2>FVXP Patron Submission</h2></div>
Someone just submitted a patron submission: ${email}

Type: ${type}
Name: ${name}
Contribution: ${contribution}
Email: ${email}

From: ${location}`,
    })
  }

  return res.status(201).json({ success: true, uid })
})
