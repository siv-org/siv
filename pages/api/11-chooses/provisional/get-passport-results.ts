import { getPassportResults } from 'api/_passportreaderapp'
import { firebase, pushover } from 'api/_services'
// import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { election_ids_for_11chooses } from 'src/vote/auth/11choosesAuth/CustomAuthFlow'

export default async function createPassportUrl(req: NextApiRequest, res: NextApiResponse) {
  const { election_id, link_auth } = req.body
  if (typeof election_id !== 'string') return res.status(400).json({ error: 'election_id is required' })
  if (!election_ids_for_11chooses.includes(election_id)) return res.status(400).json({ error: 'Invalid election_id' })
  if (!link_auth) return res.status(400).json({ error: 'link_auth is required' })

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  async function fail(message: string) {
    await pushover('11c/get-passport-results:' + message, JSON.stringify({ election_id, link_auth }))
    return res.status(400).json({ error: message })
  }

  // Lookup provisional vote by link_auth
  const [voterDoc] = (await electionDoc.collection('votes-pending').where('link_auth', '==', link_auth).get()).docs
  if (!voterDoc?.exists) return fail('Provisional ballot not found')

  // Lookup the most recent sessionId from the voterDoc
  const data = voterDoc.data()
  const { passport_sessions } = data
  if (!passport_sessions) return fail('No passport sessions to get')
  if (!Array.isArray(passport_sessions)) return fail('Passport sessions not an array')

  const mostRecentSession = passport_sessions[-1]
  if (!mostRecentSession) fail('Empty passport sessions')
  const sessionId = mostRecentSession.id

  const results = await getPassportResults(sessionId)

  const { portrait, ...resultsWithoutPortrait } = results
  void portrait
  console.log(resultsWithoutPortrait)

  // console.log({ results })

  // Validation logic
  // state == 'APPROVED'
  // issuing_country == 'USA'
  // document_type == 'PASSPORT'
  // expiry_date > Date.now()
  // match given_names to first_name
  // match surname to last_name
  // match date_of_birth to date_of_birth
  // store user_agent
  // store nationality
  // store sex

  // Store session in db
  //   await voterDoc.ref.update({
  //     passport_session: firestore.FieldValue.arrayUnion({ id, timestamp: new Date(), token }),
  //   })

  //   return res.status(200).json({ id, token })
  return res.status(200).json({ resultsWithoutPortrait })
}
