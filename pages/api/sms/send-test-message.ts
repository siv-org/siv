import { NextApiRequest, NextApiResponse } from 'next'
import { Twilio } from 'twilio'

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  void new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  return res.status(401).json({ message: 'Disabled' })

  //   const { from, to } = req.query
  //   if (typeof from !== 'string') return res.status(400).json({ error: "Missing 'from' query parameter" })
  //   if (typeof to !== 'string') return res.status(400).json({ error: "Missing 'to' query parameter" })

  //   const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  //   const twilioResponse = await client.messages.create({
  //     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
  //     from,
  //     to,
  //   })

  //   console.log({ twilioResponse })
  //   res.status(201).send({ success: true })
}
