import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover } from './_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const fields = req.body

  await Promise.all([
    // Store submission
    firebase
      .firestore()
      .collection('jurisdictions-leads')
      .doc(new Date().toISOString() + ' ' + String(Math.random()).slice(2, 7))
      .set({
        ...fields,
        created_at: new Date().toString(),
      }),

    // Notify admin
    pushover(`SIV jurisdiction-lead: ${fields.name} (${fields.location})`, `${fields.email}\n\n${fields.message}`),
  ])

  // Send back success
  return res.status(201).json({ success: true })
}
