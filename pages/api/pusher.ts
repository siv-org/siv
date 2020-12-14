import { NextApiRequest, NextApiResponse } from 'next'
import Pusher from 'pusher'

const { PUSHER_KEY, PUSHER_SECRET } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const pusher = new Pusher({
    appId: '1122652',
    cluster: 'us3',
    key: PUSHER_KEY as string,
    secret: PUSHER_SECRET as string,
    useTLS: true,
  })

  pusher.trigger('my-channel', 'my-event', {
    message: 'hidden api keys',
  })

  res.status(200).end('Success.')
}
