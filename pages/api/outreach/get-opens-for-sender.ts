import { supabase } from 'api/_supabase'
import { verify } from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

const { SUPABASE_JWT_SECRET } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { jwt, messageId } = req.query
  if (!isSupabaseJwtValidSIVEmail(jwt)) return res.status(403).json({ error: 'Forbidden' })

  if (typeof messageId !== 'string') return res.status(400).json({ error: 'Missing messageId' })

  const { data } = await supabase.from('mailgun-opens').select('*').eq('messageId', messageId.replace(/ /g, '+'))

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

function isSupabaseJwtValidSIVEmail(jwt?: string | string[]): boolean {
  // Have required params?
  if (!SUPABASE_JWT_SECRET) return false
  if (!jwt || typeof jwt !== 'string') return false

  try {
    // Is valid jwt?
    const jwt_payload = verify(jwt, SUPABASE_JWT_SECRET) as { email: string }

    // Is for a @siv.org user
    if (!jwt_payload?.email?.includes('@siv.org')) return false
  } catch (e) {
    console.error('caught error decoding jwt', e)
    return false
  }

  // Passed all checks
  return true
}
