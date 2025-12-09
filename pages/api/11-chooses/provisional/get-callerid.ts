import { firebase } from 'api/_services'
import { getCallerIdResults } from 'api/sms/lookup-test'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { link_auth, lookupNum } = req.body

  if (typeof lookupNum !== 'string') return res.status(400).json({ error: 'lookupNum is required' })
  if (typeof link_auth !== 'string') return res.status(400).json({ error: 'link_auth is required' })

  // To prevent arbitrary lookups
  // First, confirm the link_auth matches the phone number
  // Only the voter should be able to lookup their own caller ID
  const otp = (await firebase.firestore().collection('sms-otp').doc(lookupNum).get()).data()
  if (!otp) return res.status(400).json({ error: 'otp not found' })
  //   console.log('otp', otp)
  if (!otp.passed.some((p: { link_auth: string }) => p.link_auth === link_auth))
    return res.status(400).json({ error: 'link_auth does not match otp' })

  const results = await getCallerIdResults(lookupNum)
  return res.status(200).json({ results })
}
