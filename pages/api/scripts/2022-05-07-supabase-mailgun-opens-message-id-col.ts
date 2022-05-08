// This script will populate the supabase.mailgun-opens table's `messageId` column.

import { supabase } from 'api/_supabase'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Should not be accessible from public urls
  if (!req.headers.host?.includes('localhost')) return res.status(403).json({ error: 'Forbidden' })

  // Get all opens from supabase
  const { count, data: opens } = await supabase
    .from('mailgun-opens')
    .select('*', { count: 'exact' })
    .order('id', { ascending: false })
    .is('messageId', null)
    // .range(6000, 7000)
    .limit(1000)

  // Find `message-id` field
  const updates = (
    await Promise.all(
      (opens || []).map(async ({ id, json }) => {
        const eventData = json['event-data']
        if (!eventData) {
          // await supabase.from('mailgun-opens').delete().eq('id', id)
          // return `${id}: deleted`
          return `${id}: no event-data`
        }

        const messageId = eventData.message.headers['message-id']

        // Confirm extracted email is valid
        if (!messageId) {
          throw new Error(`${id}: Invalid message id (${json})`)
        }

        // Update db
        const { error } = await supabase.from('mailgun-opens').update({ messageId }).eq('id', id)

        if (error) throw error

        // return `${id}: ${messageId}`
      }),
    )
  ).filter(Boolean)

  res.status(201).send({ count, length: opens?.length, updates })
}
