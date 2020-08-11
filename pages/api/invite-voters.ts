import { NextApiRequest, NextApiResponse } from 'next'
const { ADMIN_PASSWORD, PUSHOVER_APP_TOKEN, PUSHOVER_USER_KEY } = process.env
/*
 * 1. Check for password
 * 2. Generate vote token for each voter
 * 3. Store the vote tokens in db
 * 4. Email each voter their token
 * 5. Send Admin push notification
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { password, voters } = req.body
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).end('Invalid Password.')
  }

  const tokens = voters.map(() => generateToken())

  await fetch('https://api.pushover.net/1/messages.json', {
    body: JSON.stringify({
      message: 'foobar',
      title: `Invited ${voters.length} voters`,
      token: PUSHOVER_APP_TOKEN,
      user: PUSHOVER_USER_KEY,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  res.status(200).end('Success.')
}

function generateToken() {
  const random = Math.random()
  const integer = String(random).slice(2)
  const hex = Number(integer).toString(16)
  const token = hex.slice(0, 10)
  return token
}
