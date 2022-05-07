// This script will populate the supabase.mailgun-deliveries table's `from` column.

import { supabase } from 'api/_supabase'
// import { validate as validateEmail } from 'email-validator'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Should not be accessible from public urls
  if (!req.headers.host?.includes('localhost')) return res.status(403).json({ error: 'Forbidden' })

  // Get all deliveries from supabase
  const { count, data: deliveries } = await supabase
    .from('mailgun-deliveries')
    .select('*', { count: 'exact' })
    .order('id', { ascending: true })
  // .range(6000, 7000)
  // .limit(1000)

  // Find `from` field
  await Promise.all(
    (deliveries || []).map(async ({ from, id, json }) => {
      const from_string = json['event-data'].message.headers.from

      if (from_string === from) return `${id}: done already`

      //   let email = ''
      //   // If from_string is not a valid email, extract the email from within < and >
      //   if (validateEmail(from_string)) {
      //     email = from_string
      //   } else {
      //     const after_lt = from_string.split('<')[1]
      //     if (!after_lt) throw new Error(`${id}: Invalid after_lt (${after_lt}), from_string: ${from_string}`)

      //     email = after_lt.split('>')[0]
      //   }

      //   // Confirm extracted email is valid
      //   if (!validateEmail(email)) {
      //     throw new Error(`${id}: Invalid email (${email}), from_string: ${from_string}`)
      //   }

      // Update db
      const { error } = await supabase.from('mailgun-deliveries').update({ from: from_string }).eq('id', id)

      if (error) throw error

      return `${id}: ${from_string}`
    }),
  )

  res.status(201).send({ count, length: deliveries?.length })
}
