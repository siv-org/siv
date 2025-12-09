import { firebase } from 'api/_services'
import { firestore } from 'firebase-admin'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

export default setCORSForAllowedDomains(async (req: NextApiRequest, res: NextApiResponse) => {
  const { confirmed_sms, election_id, firebase_uid, link_auth } = req.body
  if (typeof confirmed_sms !== 'string') return res.status(400).json({ error: 'Missing required field: confirmed_sms' })
  if (typeof firebase_uid !== 'string') return res.status(400).json({ error: 'Missing required field: firebase_uid' })
  if (typeof election_id !== 'string') return res.status(400).json({ error: 'Missing required field: election_id' })
  if (typeof link_auth !== 'string') return res.status(400).json({ error: 'Missing required field: link_auth' })

  await firebase
    .firestore()
    .collection('sms-otp')
    .doc(confirmed_sms)
    .set(
      {
        passed: firestore.FieldValue.arrayUnion({
          confirmed_sms,
          election_id,
          firebase_uid,
          link_auth,
          timestamp: new Date(),
        }),
      },
      { merge: true },
    )

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
