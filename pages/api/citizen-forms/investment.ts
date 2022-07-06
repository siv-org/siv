import { validate as validateEmail } from 'email-validator'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover } from '../_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const fields = req.body

  // Validate submission
  if (typeof fields !== 'object') return res.status(400).json({ error: 'Invalid submission' })
  if (!Object.keys(fields).length) return res.status(400).json({ error: 'Invalid submission' })
  if (fields.email && !validateEmail(fields.email)) {
    await pushover(`SIV Endorsement Invalid Email`, JSON.stringify(fields))
    return res.status(400).json({ error: 'Invalid email' })
  }

  // Store submission in Firestore
  await firebase
    .firestore()
    .collection('investments')
    .doc(new Date().toISOString() + ' ' + String(Math.random()).slice(2, 7))
    .set({
      ...fields,
      created_at: new Date().toString(),
    })

  // Notify admin via Pushover
  await pushover(`SIV Investment: ${fields.name}`, `${fields.email}\n\n${fields.amount}`)

  // Send back success
  return res.status(201).json({ success: true })
}
