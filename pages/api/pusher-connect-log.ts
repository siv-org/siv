import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from './_services'

/** Client beacons here once per new Pusher() connection (see src/pusher-helper). */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end()

  const { path } = req.body || {}
  if (typeof path !== 'string' || !path.startsWith('/') || path.length > 500)
    return res.status(400).json({ error: 'Invalid path' })

  await firebase
    .firestore()
    .collection('pusher-connect-logs')
    .add({
      created_at: new Date(),
      geoip: {
        city: req.headers['x-vercel-ip-city'] || '',
        country: req.headers['x-vercel-ip-country'] || '',
        region: req.headers['x-vercel-ip-country-region'] || '',
      },
      ip: String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || ''),
      path,
      user_agent: req.headers['user-agent'] || '',
    })

  return res.status(204).end()
}
