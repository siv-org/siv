// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiResponse, NextApiRequest, NextApiHandler } from 'next'

const handler = (req: NextApiRequest, res: NextApiResponse): NextApiHandler => {
  res.statusCode = 200
  res.json({ name: 'John Doe' })
}

export default handler
