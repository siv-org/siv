import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover } from './_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body

  // Store submission in Firestore
  await firebase
    .firestore()
    .collection('news-signups')
    .doc(new Date().toISOString() + ' ' + String(Math.random()).slice(2, 7))
    .set({
      created_at: new Date().toString(),
      email,
    })

  // Notify admin via Pushover
  pushover(`SIV newsletter signup`, email)

  // Send back success
  return res.status(201).json({ success: true })
}
