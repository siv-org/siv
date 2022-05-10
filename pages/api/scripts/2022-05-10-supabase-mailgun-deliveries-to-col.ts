// This script will populate the supabase.mailgun-deliveries table's `to` column.

import { supabase } from 'api/_supabase'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Should not be accessible from public urls
  if (!req.headers.host?.includes('localhost')) return res.status(403).json({ error: 'Forbidden' })

  // Get all deliveries from supabase
  const { count, data: deliveries } = await supabase
    .from('mailgun-deliveries')
    .select('*', { count: 'exact' })
    .order('id', { ascending: false })
    .is('to', null)
    // .range(6000, 7000)
    .limit(1000)

  // Find `to` field
  await Promise.all(
    (deliveries || []).map(async ({ id, json }) => {
      const { to } = json['event-data'].message.headers

      // Update db
      const { error } = await supabase.from('mailgun-deliveries').update({ to }).eq('id', id)

      if (error) throw error

      return `${id}: ${to}`
    }),
  )

  res.status(201).send({ count, length: deliveries?.length })
}
