import { NextApiRequest, NextApiResponse } from 'next'

import { pushover } from './_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { message, title } = req.body

  await pushover(title, message)

  res.status(200).end('Success.')
}
