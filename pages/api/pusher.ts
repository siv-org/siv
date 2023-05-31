import { NextApiRequest, NextApiResponse } from 'next'
import Pusher from 'pusher'

const { PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET } = process.env

/** Send updates to subscribed browsers over Websockets */
export const pusher = new Pusher({
  appId: PUSHER_APP_ID || '1122652',
  cluster: 'us3',
  key: PUSHER_KEY as string,
  secret: PUSHER_SECRET as string,
  useTLS: true,
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).end('Success.')
}
