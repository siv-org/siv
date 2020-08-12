import { NextApiRequest, NextApiResponse } from 'next'

import { pushover } from '../../src/admin/services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { message, title } = req.body

  pushover(title, message)

  res.status(200).end('Success.')
}
