import { supabase } from 'api/_supabase'
import { verify } from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Check supabase JWT is for a valid for @siv.org user
  if (!SUPABASE_JWT_SECRET) return res.status(401).json({ error: 'Missing JWT_SECRET' })
  const { jwt, messageId } = req.query
  if (!jwt) return res.status(403).json({ error: 'Forbidden' })
  try {
    const jwt_payload = verify(jwt as string, SUPABASE_JWT_SECRET) as { email: string }
    if (!jwt_payload?.email?.includes('@siv.org')) return res.status(403).json({ error: 'Forbidden' })
  } catch (e) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const { data } = await supabase.from('mailgun-opens').select('*').eq('messageId', messageId)

  if (!data) {
    return res.status(404).json({ opens: {} })
  }

  const opens = data.reduce((acc, { created_at, recipient }) => {
    acc[recipient] = acc[recipient] || []
    acc[recipient].push(created_at)
    return acc
  }, {})

  return res.status(200).json({ opens })
}
