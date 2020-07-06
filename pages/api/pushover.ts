import { NextApiRequest, NextApiResponse } from 'next'
const { PUSHOVER_APP_TOKEN, PUSHOVER_USER_KEY } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { message, title } = req.body

  await fetch('https://api.pushover.net/1/messages.json', {
    body: JSON.stringify({ message, title, token: PUSHOVER_APP_TOKEN, user: PUSHOVER_USER_KEY }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  res.status(200).end('Success.')
}
