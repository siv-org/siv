import { NextApiRequest, NextApiResponse } from 'next'
import { Twilio } from 'twilio'

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env
const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  void client
  return res.status(401).json({ message: 'Disabled' })

  // const lookupNum = '+15551234567'

  // const phoneNumber = await client.lookups.v2
  //   .phoneNumbers(lookupNum)
  //   .fetch({ fields: 'line_type_intelligence,caller_name' })

  // const results = { lookupNum, phoneNumber }

  // console.log(JSON.stringify(results, null, 2))

  // res.status(201).json({ results, success: true })
}
