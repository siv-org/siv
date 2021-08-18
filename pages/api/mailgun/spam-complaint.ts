import { NextApiRequest, NextApiResponse } from 'next'

import { pushover } from '../_services'
import { supabase } from '../_supabase'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log(req.body)

  const { data, error } = await supabase.from('mailgun-spam-complaints').insert([{ json: req.body }])

  if (error) {
    console.error(error)
    await pushover('mailgun-spam-complaints webhook error', JSON.stringify(error))
    return res.status(400).send({ error })
  }

  // console.log({ data })

  await pushover('mailgun-spam-complaints', JSON.stringify(error))

  res.status(200).send({ data })
}
