import { firebase, pushover } from 'api/_services'
import { getCallerIdResults } from 'api/sms/lookup-test'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { election_ids_for_11chooses } from 'src/vote/auth/11choosesAuth/CustomAuthFlow'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { election_id, link_auth, lookupNum } = req.body
  if (typeof election_id !== 'string') return res.status(400).json({ error: 'election_id is required' })
  if (!election_ids_for_11chooses.includes(election_id)) return res.status(400).json({ error: 'Invalid election_id' })

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

  // @ts-expect-error weird typing
  const callerID = results.callerName?.caller_name

  await pushover('11c/get-callerid', `[${link_auth}] ${lookupNum}: ${callerID}`)

  // Update the voterDoc with the callerID
  await firebase
    .firestore()
    .collection('elections')
    .doc(election_id)
    .collection('votes-pending')
    .doc(link_auth)
    .update({
      caller_id: firestore.FieldValue.arrayUnion({ callerID, phone: lookupNum, timestamp: new Date() }),
    })

  return res.status(200).json({ results })
}
