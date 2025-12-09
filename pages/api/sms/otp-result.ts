import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

export default setCORSForAllowedDomains(async (req: NextApiRequest, res: NextApiResponse) => {
  const { confirmed_sms, firebase_uid, session_id } = req.body
  if (typeof confirmed_sms !== 'string') return res.status(400).json({ error: 'Missing required field: confirmed_sms' })
  if (typeof firebase_uid !== 'string') return res.status(400).json({ error: 'Missing required field: firebase_uid' })
  if (typeof session_id !== 'string') return res.status(400).json({ error: 'Missing required field: session_id' })

  return res.status(200).json({ message: 'Success' })
})

const allowedDomains = ['https://sms.siv.org']

/** Only allow whitelisted prod URLs, or dev URLs (any port) */
const isAllowedDomain = (origin: string) =>
  allowedDomains.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')

function setCORSForAllowedDomains(fn: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const origin = req.headers.origin

    // Block non-allowed domains
    if (!origin || !isAllowedDomain(origin)) return res.status(403).json({ error: 'Forbidden' })

    // Allow the whitelisted origin
    res.setHeader('Access-Control-Allow-Origin', origin)

    // Additional headers for Preflight
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'POST')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      return res.status(200).end()
    }

    // Call the original endpoint function
    return await fn(req, res)
  }
}
