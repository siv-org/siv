import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

import { pushover } from '../_services'

const { SUPABASE_ADMIN_KEY, SUPABASE_DB_URL } = process.env

if (!SUPABASE_ADMIN_KEY) throw new TypeError('SUPABASE_ADMIN_KEY undefined')
if (!SUPABASE_DB_URL) throw new TypeError('SUPABASE_ADMIN_KEY undefined')

const supabase = createClient(SUPABASE_DB_URL, SUPABASE_ADMIN_KEY)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log(req.body)

  const { data, error } = await supabase.from('mailgun-opens').insert([{ json: req.body }])

  if (error) {
    console.error(error)
    pushover('mailgun-opens webhook error', JSON.stringify(error))
    return res.status(400).send({ error })
  }

  // console.log({ data })

  res.status(200).send({ data })
}
