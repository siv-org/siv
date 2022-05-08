import { supabase } from 'api/_supabase'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO: Check supabase JWT is for a valid for @siv.org user
  // TEMP FIX: Block from non-localhost
  if (!req.headers.host?.includes('localhost')) return res.status(403).json({ error: 'Forbidden' })

  const { data } = await supabase.from('mailgun-opens').select('*').eq('messageId', req.query.messageId)

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
