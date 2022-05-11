// This script will populate the supabase.mailgun-permanent-failures table's `from`, `to`, and `subject` columns.

import { supabase } from 'api/_supabase'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Should not be accessible from public urls
  if (!req.headers.host?.includes('localhost')) return res.status(403).json({ error: 'Forbidden' })

  const table = 'mailgun-permanent-failures'
  const fields = ['from', 'to', 'subject']

  const updates = await Promise.all(
    fields.map(async (field) => {
      // Get all rows from supabase missing field
      const { count, data: rows } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .order('id', { ascending: false })
        .is(field, null)
        // .range(6000, 7000)
        .limit(5)

      // Find `recipient` field
      return {
        count,
        field,
        length: rows?.length,
        update: (
          await Promise.all(
            (rows || []).map(async ({ id, json }) => {
              const msg = json['event-data'].message
              if (!msg) return `${id} - No event data`

              const val = msg.headers[field]

              // Confirm extracted email is valid
              if (!val) return `${id}: Missing '${field}': ${json}`

              // Update db
              const { error } = await supabase
                .from(table)
                .update({ [field]: val })
                .eq('id', id)

              if (error) throw error

              return `${id}. ${field}: ${val}`
            }),
          )
        ).filter(Boolean),
      }
    }),
  )

  res.status(201).send({ updates })
}
