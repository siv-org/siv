import { pushover } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'
import { live11chooses } from 'src/vote/YourAuthToken'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id, link_auth } = req.body

  const headers = ['x-vercel-ip-city', 'x-vercel-ip-country-region', 'x-vercel-ip-country']
  const location = headers.map((header) => req.headers[header]?.toString().replaceAll('%20', ' ')).join(', ')

  const notProd = election_id !== live11chooses

  await pushover(
    `11c/zoom-interest${notProd ? ' (test)' : ''}`,
    `request received from: ${location} (${req.headers['x-real-ip']})\n\n${link_auth}`,
  )
  return res.status(200).json({ success: true })
}
