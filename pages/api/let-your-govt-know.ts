import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover } from './_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const fields = req.body

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
  pushover(`SIV Endorsement: ${fields.name} (${fields.zip})`, `${fields.email}\n\n${fields.message}`)

  // Send back success
  return res.status(201).json({ success: true })
}
