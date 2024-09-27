import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

import { cookie_name } from '../../src/admin/auth'
import { firebase, pushover } from './_services'
import { JWT_Payload } from './admin-check-login-code'

const { JWT_SECRET } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const result = checkJwt(req, res)
  if (result.valid) return res.status(200).send(result)
}

export function checkJwt(
  req: NextApiRequest,
  res: NextApiResponse,
): { res: void; valid: false } | ({ valid: true } & JWT_Payload) {
  if (!JWT_SECRET) return { res: res.status(401).send({ error: `Missing process.env JWT_SECRET` }), valid: false }

  const cookie = req.cookies[cookie_name]

  // Are they missing a jwt cookie?
  if (!cookie) return { res: res.status(401).send({ error: 'Missing JWT cookie' }), valid: false }

  // Is it valid jwt?
  let payload: JWT_Payload = { email: '', name: '' }
  try {
    payload = jwt.verify(cookie, JWT_SECRET) as JWT_Payload
  } catch (e) {
    pushover(
      'Invalid JWT signature',
      `${req.headers.origin} ${req.url}\n${JSON.stringify(jwt.decode(cookie))}\n${cookie}`,
    )
    return { res: res.status(401).send({ error: 'Invalid JWT' }), valid: false }
  }

  // Otherwise, it passes
  return { ...payload, valid: true }
}

export async function checkJwtOwnsElection(
  req: NextApiRequest,
  res: NextApiResponse,
  election_id: string,
): Promise<
  | { res: void; valid: false }
  | ({
      ballot_design: string
      ballot_design_finalized?: boolean
      election_manager: string
      election_title: string
      num_votes: number
      valid: true
    } & JWT_Payload)
> {
  const jwt_status = checkJwt(req, res)

  // Fail immediately if checkJwt failed
  if (!jwt_status.valid) return jwt_status

  // Grab this election info
  const election = { ...(await firebase.firestore().collection('elections').doc(election_id).get()).data() }

  // Check if this this admin is the creator of the given election
  if (jwt_status.email !== election.creator) {
    return { res: res.status(401).send({ error: `This user did not create election ${election_id}` }), valid: false }
  }

  // Otherwise it passes
  return {
    ballot_design: election.ballot_design,
    ballot_design_finalized: election.ballot_design_finalized,
    election_manager: election.election_manager,
    election_title: election.election_title,
    num_votes: election.num_votes,
    ...jwt_status,
  }
}

export type Convention = {
  active_redirect?: string
  convention_title: string
  created_at: { _seconds: number }
  creator: string
  id: string
  num_qrs: number
  qrs: { createdAt: { _seconds: number }; number: number }[]
}

export async function checkJwtOwnsConvention(
  req: NextApiRequest,
  res: NextApiResponse,
  convention_id: string,
): Promise<{ res: void; valid: false } | ({ valid: true } & Convention & JWT_Payload)> {
  const jwt_status = checkJwt(req, res)

  // Fail immediately if checkJwt failed
  if (!jwt_status.valid) return jwt_status

  // Grab this convention info
  const convention = {
    ...(await firebase.firestore().collection('conventions').doc(convention_id).get()).data(),
  } as Convention

  // Check if this this admin is the creator of the given convention
  if (jwt_status.email !== convention.creator) {
    return {
      res: res.status(401).send({ error: `This user did not create convention ${convention_id}` }),
      valid: false,
    }
  }

  // Otherwise it passes
  return {
    ...convention,
    ...jwt_status,
  }
}
