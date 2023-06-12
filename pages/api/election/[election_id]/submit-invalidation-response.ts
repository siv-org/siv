import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { auth, message } = req.body
  const { election_id } = req.query

  console.log(auth, message, election_id)
  // handle the message here
  // e.g., store in a database or send an email

  res.status(200).json({ message: 'Message received' })
}
