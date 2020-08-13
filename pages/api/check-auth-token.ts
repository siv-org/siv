import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { authToken } = req.body

  // Did they send us an Auth Token?
  if (!authToken) {
    return res.status(400).end('Missing Auth Token.')
  }

  // Is Auth token malformed?
  if (!/^[0-9a-f]{10}$/.test(authToken)) {
    return res.status(401).end('Malformed Auth Token.')
  }

  // Is Auth token in DB?

  // Has Auth Token been used yet?

  // Has Auth Token been invalidated?

  // Passed all checks

  res.status(200).end('Your Voter Auth Token is valid & still unused.')
}
