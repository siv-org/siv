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

  // await pushover('11c/get-callerid', `[${link_auth}] ${lookupNum}: ${callerID}`)

  // Get the provisional voter doc
  const provisionalVoterDoc = firebase
    .firestore()
    .collection('elections')
    .doc(election_id)
    .collection('votes-pending')
    .doc(link_auth)

  const data = (await provisionalVoterDoc.get()).data()
  if (!data) {
    await pushover(
      '11c/get-callerid: provisional ballot not found',
      `${election_id}, ${link_auth}, ${lookupNum}, ${callerID}`,
    )
    return res.status(400).json({ error: 'provisional ballot not found' })
  }

  const { 'First Name': first_name, 'Last Name': last_name } = data.voterRegInfo?.at(-1)?.submission || {}
  const { match, reason } = isMatchingCallerID(first_name, last_name, callerID)

  const voterDocUpdate: Record<string, unknown> = {
    caller_id: firestore.FieldValue.arrayUnion({
      callerID,
      callerIdMatch: { match, reason },
      phone: lookupNum,
      timestamp: new Date(),
    }),
  }
  if (match) voterDocUpdate.is_auth_complete = { timestamp: new Date(), type: 'callerid' }

  // Update the voterDoc with the callerID
  await provisionalVoterDoc.update(voterDocUpdate)

  return res.status(200).json({ callerID, match, results })
}

function isMatchingCallerID(submittedFirst?: string, submittedLast?: string, callerID?: null | string) {
  if (!submittedFirst) return { match: false, reason: 'Missing submitted first name' }
  if (!submittedLast) return { match: false, reason: 'Missing submitted last name' }

  const last = normalizeAscii(submittedLast.trim())
  const first = normalizeAscii(submittedFirst.trim())

  if (!callerID) return { match: false, reason: 'No caller ID' }

  if (`${first} ${last}`.toUpperCase() === callerID) return { match: true, reason: 'First Last' }

  if (`${last},${first}`.toUpperCase() === callerID) return { match: true, reason: 'Last,First' }

  if (callerID.startsWith(`${last},${first.slice(0, 3)}`.toUpperCase())) return { match: true, reason: 'Last,First3' }

  if (callerID.startsWith(`${last},`.toUpperCase())) return { match: true, reason: 'Last,' }

  if (`${last} ${first}`.toUpperCase() === callerID) return { match: true, reason: 'Last First' }

  if (callerID.endsWith(`${last}`.toUpperCase())) return { match: true, reason: 'match Last' }

  return { match: false, reason: 'No match' }
}

function normalizeAscii(s: string) {
  return s
    .normalize('NFD') // split accents from base chars
    .replace(/[\u0300-\u036f]/g, '') // drop diacritics
}
