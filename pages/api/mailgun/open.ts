import { NextApiRequest, NextApiResponse } from 'next'

import { pushover } from '../_services'
import { supabase } from '../_supabase'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log(req.body)

  const json = req.body
  const eventData = json['event-data']
  const { recipient, tags } = eventData

  const { error } = await supabase.from('mailgun-opens').insert([{ json: req.body, recipient, tags }])

  if (error) {
    console.error(error)
    await pushover('mailgun-opens webhook error', JSON.stringify(error))
    return res.status(400).send({ error })
  }

  // console.log({ data })

  res.status(200).send('Success')
}
