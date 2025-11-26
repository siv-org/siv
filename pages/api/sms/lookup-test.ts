import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'
import { Twilio } from 'twilio'

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env
const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Comment out to test the endpoint locally
  const DISABLED = true
  if (DISABLED) return res.status(401).json({ message: 'Disabled' })

  const lookupNum = '+15551234567'.replace(/[ ()-]/g, '')

  // First check if DB already has the result for this lookup:
  const dbInfo = await firebase.firestore().collection('sms-lookup').doc(lookupNum).get()

  let results = null
  if (dbInfo.exists) {
    results = { cachedFromDb: true, ...dbInfo.data() }
  } else {
    const twilioResults = await callerIdLookup(lookupNum)
    // @ts-expect-error intentionally removing this circular reference
    delete twilioResults._version

    results = { ...twilioResults, lookupTime: new Date().toISOString() }
    console.log(results)

    // Cache the results in DB.
    await firebase.firestore().collection('sms-lookup').doc(lookupNum).set(results)
    results = { ...results, cachedToDb: true }
  }

  // Then check if DB already has the result for this lookup:
  // const results = await callerIdLookup(lookupNum)

  // Add current timestamp to output
  results = { ...results, current_time: new Date().toISOString() }

  console.log(JSON.stringify(results, null, 2))
  res.status(201).json({ results })
}

function callerIdLookup(lookupNum: string) {
  return client.lookups.v2.phoneNumbers(lookupNum).fetch({ fields: 'caller_name' })
}
// function carrierLookup(lookupNum: string) {
//   return client.lookups.v2.phoneNumbers(lookupNum).fetch({ fields: 'line_type_intelligence' })
// }
// function callerIdAndCarrierLookup(lookupNum: string) {
//   return client.lookups.v2.phoneNumbers(lookupNum).fetch({ fields: 'caller_name,line_type_intelligence' })
// }
