import { NextApiRequest, NextApiResponse } from 'next'

import { pushover } from '../_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { question } = req.body

  const headers = ['x-vercel-ip-city', 'x-vercel-ip-country-region', 'x-vercel-ip-country']
  const location = headers.map((header) => req.headers[header]?.toString().replaceAll('%20', ' ')).join(', ')

  await pushover('/dec25/create-vote', `question: ${question}\n\n[${location}: ${req.headers['x-real-ip']}]`)

  return res.status(200).json({ message: 'Vote created' })
}
