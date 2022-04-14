import { pusher } from 'api/pusher'
import { NextApiRequest, NextApiResponse } from 'next'

import { pushover } from '../_services'
import { supabase } from '../_supabase'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log(req.body)

  const json = req.body
  const eventData = json['event-data']
  if (!eventData) {
    console.error('Missing event data. req.body:', req.body)
    console.error('req.headers:', req.headers)
    return res.status(400).json({ error: 'Missing event data.' })
  }
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
  if (tags && Array.isArray(tags))
    await Promise.all(tags.map((tag) => tag && pusher.trigger(fixPusherChannelName(tag), 'delivery', '')))

  // console.log({ data })

  res.status(200).send('Success')
}

function fixPusherChannelName(channelName: string) {
  // See https://support.pusher.com/hc/en-us/articles/4411990469265-What-Does-The-Error-Invalid-channel-name-Mean-
  const prohibitedChars = /[^a-zA-Z0-9_\-=@,.;]/g // first ^ is negation
  return channelName.replace(prohibitedChars, '').slice(0, 164)
}
