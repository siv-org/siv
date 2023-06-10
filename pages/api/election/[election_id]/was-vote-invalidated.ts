// given auth and election id, tell us if the vote was invalidated or not

import { NextApiRequest, NextApiResponse } from 'next'

export default function (req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json(true)
}
