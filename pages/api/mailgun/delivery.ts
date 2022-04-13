import { pusher } from 'api/pusher'
import { NextApiRequest, NextApiResponse } from 'next'

import { pushover } from '../_services'
import { supabase } from '../_supabase'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log(req.body)

  const json = req.body
  const eventData = json['event-data']
  const { message, tags } = eventData
  const { headers } = message
  const { subject, to } = headers

  const { error } = await supabase.from('mailgun-deliveries').insert([{ json, subject, tags, to }])

  if (error) {
    console.error(error)
    await pushover('mailgun-deliveries webhook error', JSON.stringify(error))
    return res.status(400).send({ error })
  }

  // Notify any pusher subscriptions listening for this tag
  if (tags && Array.isArray(tags)) await Promise.all(tags.map((tag) => pusher.trigger(tag, 'delivery', '')))

  // console.log({ data })

  res.status(200).send('Success')
}
