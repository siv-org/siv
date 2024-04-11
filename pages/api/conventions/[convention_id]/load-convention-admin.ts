import { NextApiRequest, NextApiResponse } from 'next'

// import { firebase } from '../_services'
import { checkJwtOwnsConvention } from '../../validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { convention_id } = req.query
  if (!convention_id || typeof convention_id !== 'string')
    return res.status(401).json({ error: `Missing convention_id` })

  // Confirm they created this convention
  const jwt = await checkJwtOwnsConvention(req, res, convention_id)
  if (!jwt.valid) return

  res.status(200).send({ ...jwt })
}
