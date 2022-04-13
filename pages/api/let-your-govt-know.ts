import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover } from './_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const fields = req.body

  if (typeof fields !== 'object') return res.status(400).json({ error: 'Invalid submission' })
  if (!Object.keys(fields).length) return res.status(400).json({ error: 'Invalid submission' })
  if (!fields.zip) return res.status(400).json({ error: 'Zip code is required' })
  const startsWithThreeDigitsRegex = /^\d{3}/
  if (!startsWithThreeDigitsRegex.test(fields.zip)) {
    await pushover(`SIV Endorsement Invalid ZIP Code`, JSON.stringify(fields))
    return res.status(400).json({ error: 'Invalid zip code' })
  }

  // Store submission in Firestore
  await firebase
    .firestore()
    .collection('endorsers')
    .doc(new Date().toISOString() + ' ' + String(Math.random()).slice(2, 7))
    .set({
      ...fields,
      created_at: new Date().toString(),
    })

  // Notify admin via Pushover
  await pushover(`SIV Endorsement: ${fields.name} (${fields.zip})`, `${fields.email}\n\n${fields.message}`)

  // Send back success
  return res.status(201).json({ success: true })
}
