import { NextApiRequest, NextApiResponse } from 'next'

type NextApiRoute = (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>

// Wrap another route handler with CORS headers
export const allowCors = (fn: NextApiRoute) => async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Credentials', true as unknown as string)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

// Example route
export default allowCors((req: NextApiRequest, res: NextApiResponse) => {
  const d = new Date()
  res.end(d.toString())
})
