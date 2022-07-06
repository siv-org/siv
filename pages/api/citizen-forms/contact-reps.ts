import { validate as validateEmail } from 'email-validator'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover } from '../_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const fields = req.body

  // Validate submission
  if (typeof fields !== 'object') return res.status(400).json({ error: 'Invalid submission' })
  if (!Object.keys(fields).length) return res.status(400).json({ error: 'Invalid submission' })
  if (!fields.zip) return res.status(400).json({ error: 'Zip code is required' })
  const startsWithThreeDigitsRegex = /^\d{3}/
  if (!startsWithThreeDigitsRegex.test(fields.zip)) {
    await pushover(`SIV Endorsement Invalid ZIP Code`, JSON.stringify(fields))
    return res.status(400).json({ error: 'Invalid zip code' })
  }
  if (fields.email && !validateEmail(fields.email)) {
    await pushover(`SIV Endorsement Invalid Email`, JSON.stringify(fields))
    return res.status(400).json({ error: 'Invalid email' })
  }

  // Store submission in Firestore
  await firebase
    .firestore()
    .collection('contact-reps')
    .doc(new Date().toISOString() + ' ' + String(Math.random()).slice(2, 7))
    .set({
      ...fields,
      created_at: new Date().toString(),
    })

  // Notify admin via Pushover
  await pushover(`SIV Contact-Rep Form: ${fields.name} (${fields.zip})`, `${fields.email}\n\n${fields.message}`)

  // Send back success
  return res.status(201).json({ success: true })
}
