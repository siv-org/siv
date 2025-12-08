import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { confirmed_sms, firebase_uid, session_id } = req.body
  if (typeof confirmed_sms !== 'string') return res.status(400).json({ error: 'Missing required field: confirmed_sms' })
  if (typeof firebase_uid !== 'string') return res.status(400).json({ error: 'Missing required field: firebase_uid' })
  if (typeof session_id !== 'string') return res.status(400).json({ error: 'Missing required field: session_id' })

  return res.status(200).json({ message: 'OTP result stored' })
}
