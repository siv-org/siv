import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

import { cookie_name } from '../../src/admin/auth'
import { JWT_Payload } from './admin-check-login-code'

const JWT_SECRET = 'foobar'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (checkJwt(req, res).valid) return res.status(200).send({ message: 'Valid JWT ' })
}

export function checkJwt(
  req: NextApiRequest,
  res: NextApiResponse,
): { res: void; valid: false } | ({ valid: true } & JWT_Payload) {
  const cookie = req.cookies[cookie_name]

  // Are they missing a jwt cookie?
  if (!cookie) return { res: res.status(401).send({ error: 'Missing JWT cookie' }), valid: false }

  // Is it valid jwt?
  if (!jwt.verify(cookie, JWT_SECRET)) return { res: res.status(401).send({ error: 'Invalid JWT' }), valid: false }

  const payload = jwt.decode(cookie) as JWT_Payload

  // Otherwise, it passes
  return { ...payload, valid: true }
}
