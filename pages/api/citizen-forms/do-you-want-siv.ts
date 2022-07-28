import { validate as validateEmail } from 'email-validator'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover } from '../_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const fields = req.body
  console.log(fields)

  // Validate submission
  if (typeof fields !== 'object') return res.status(400).json({ error: 'Invalid submission' })
  if (!Object.keys(fields).length) return res.status(400).json({ error: 'Invalid submission' })
  if (fields.email && !validateEmail(fields.email)) {
    await pushover(`SIV Endorsement Invalid Email`, JSON.stringify(fields))
    return res.status(400).json({ error: 'Invalid email' })
  }

  const id = fields.id || new Date().toISOString() + ' ' + String(Math.random()).slice(2, 7)

  // Store submission in Firestore
  await firebase
    .firestore()
    .collection('do-you-want-siv')
    .doc(id)
    .set({
      ...fields,
      created_at: new Date().toString(),
    })

  //  Notify admin via Pushover

  await pushover(`SIV investment-questions: ${fields.name} `, `${fields.email}\n\n${fields.question}`)

  // Send back success
  return res.status(201).json({ id, success: true })
}
