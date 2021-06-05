import { NextApiRequest, NextApiResponse } from 'next'

// import { firebase, pushover, sendEmail } from './_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email }: { email: string } = req.body

  // Confirm they sent a valid email address
  if (!email) return res.status(400).send('Missing email')
  if (!email.includes('@') || !email.includes('.')) return res.status(400).send('Malformed')

  res.status(200).send('Success')
}
