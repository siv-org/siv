import { allowCors } from 'api/_cors'
import { pushover } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'

export default allowCors(async (req: NextApiRequest, res: NextApiResponse) => {
  const headers = ['x-vercel-ip-city', 'x-vercel-ip-country-region', 'x-vercel-ip-country']
  const location = headers.map((header) => req.headers[header]).join(', ')

  await pushover('11c/provisional-coming-soon', 'request received from: ' + location)
  return res.status(200).json({ success: true })
})
