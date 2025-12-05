import { createSession } from 'api/_passportreaderapp'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function createPassportUrl(req: NextApiRequest, res: NextApiResponse) {
  const { id, token } = await createSession()

  return res.status(200).json({ id, token })
}
