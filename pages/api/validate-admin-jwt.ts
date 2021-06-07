import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

const JWT_SECRET = 'foobar'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookie = req.cookies['siv-jwt']

  // Are they missing a jwt cookie?
  if (!cookie) return res.status(403).send({ error: 'Missing JWT cookie' })

  // Is it valid jwt?
  if (!jwt.verify(cookie, JWT_SECRET)) return res.status(403).send({ error: 'Invalid JWT' })

  return res.status(200).send({ message: 'Valid JWT' })
}
