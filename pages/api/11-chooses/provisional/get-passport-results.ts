import { getPassportResults } from 'api/_passportreaderapp'
import { firebase, pushover } from 'api/_services'
import { firestore } from 'firebase-admin'
import { pick } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'
import { election_ids_for_11chooses } from 'src/vote/auth/11choosesAuth/CustomAuthFlow'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { election_id, link_auth } = req.body
  if (typeof election_id !== 'string') return res.status(400).json({ error: 'election_id is required' })
  if (!election_ids_for_11chooses.includes(election_id)) return res.status(400).json({ error: 'Invalid election_id' })
  if (!link_auth) return res.status(400).json({ error: 'link_auth is required' })

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  async function fail(message: string, results?: unknown) {
    await pushover('11c/get-passport-results: ' + message, JSON.stringify({ election_id, link_auth, results }))
    return res.status(400).json({ error: message, results })
  }

  // Lookup provisional vote by link_auth
  const [voterDoc] = (await electionDoc.collection('votes-pending').where('link_auth', '==', link_auth).get()).docs
  if (!voterDoc?.exists) return fail('Provisional ballot not found')

  // Lookup the most recent sessionId from the voterDoc
  const { passport_session_id, voterRegInfo } = voterDoc.data()
  if (!passport_session_id) return fail('No passport session to get')
  const results = await getPassportResults(passport_session_id)

  const lastVoterRegSubmission = voterRegInfo?.at(-1)

  // These are the fields we care about for verification
  const keep = pick(results, [
    'date_of_birth',
    'document_type',
    'expiry_date',
    'given_names',
    'issuing_country',
    'nationality', // store for edge-cases
    'sex', // store for stats
    'state',
    'surname',
    'user_agent', // store for debugging passport reader app
  ])
  const failWithResults = async (message: string) => {
    await voterDoc.ref.update({
      passport_verif_fail: firestore.FieldValue.arrayUnion({
        passport_results: keep,
        passport_session_id,
        timestamp: new Date(),
      }),
    })
    return fail(message, keep)
  }

  // // Validation logic
  // Does the reader app say the passport passed?
  if (keep.state !== 'APPROVED') return failWithResults('Passport state: ' + keep.state + ' is not Approved')
  // American issued?
  if (keep.issuing_country !== 'US') return failWithResults('Issuing country must be US, got: ' + keep.issuing_country)
  // Is a passport?
  if (keep.document_type !== 'PASSPORT') return failWithResults('Document must be Passport, got: ' + keep.document_type)
  // Not expired?
  if (keep.expiry_date < new Date().toISOString()) return failWithResults('Expiry date past, got: ' + keep.expiry_date)
  // Match given_names to first_name
  const submittedFirst = lastVoterRegSubmission?.['First Name']
  if (!submittedFirst.toUpperCase()?.includes(keep.given_names)) {
    if (submittedFirst && !keep.given_names.includes(submittedFirst.toUpperCase()))
      return failWithResults('First name mismatch— passport: ' + keep.given_names + ' | voter-reg: ' + submittedFirst)
  }
  // Match surname to last_name
  const submittedLast = lastVoterRegSubmission?.['Last Name']
  if (!submittedLast.toUpperCase()?.includes(keep.surname)) {
    if (submittedLast && !keep.surname.includes(submittedLast.toUpperCase()))
      return failWithResults('Last name mismatch— passport: ' + keep.surname + ' | voter-reg: ' + submittedLast)
  }
  // Match date_of_birth to date_of_birth
  const submittedDoB = lastVoterRegSubmission?.['Date of Birth (MM-DD-YYYY)']
  const [YYYY, MM, DD] = keep.date_of_birth.split('-') // YYYY-MM-DD
  const passportAmericanFormat = `${MM}-${DD}-${YYYY}`
  if (submittedDoB !== passportAmericanFormat)
    return failWithResults('Date of birth mismatch— passport: ' + keep.date_of_birth + ' | voter-reg: ' + submittedDoB)

  // Store successful verification in db
  await voterDoc.ref.update({
    passport_success: firestore.FieldValue.arrayUnion({ passport: keep, passport_session_id, timestamp: new Date() }),
  })

  return res.status(200).json({ success: true })
}
