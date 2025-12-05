import { firebase, pushover } from 'api/_services'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { election_ids_for_11chooses } from 'src/vote/auth/11choosesAuth/CustomAuthFlow'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Validate request body
  const { auth_token, election_id, yearOfBirth } = req.body
  if (typeof auth_token !== 'string') return res.status(400).json({ error: 'auth_token is required' })
  if (typeof yearOfBirth !== 'string') return res.status(400).json({ error: 'yearOfBirth is required' })
  if (typeof election_id !== 'string') return res.status(400).json({ error: 'election_id is required' })
  if (!election_ids_for_11chooses.includes(election_id)) return res.status(400).json({ error: 'Invalid election_id' })

  // Lookup voter by auth_token
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const [voterDoc] = (await electionDoc.collection('voters').where('auth_token', '==', auth_token).get()).docs

  // If voter not found, error and ping admin
  if (!voterDoc?.exists) {
    await pushover('11c/submit-yob: auth not found', JSON.stringify({ auth_token }))
    return res.status(400).json({ error: 'voter not found' })
  }

  const { voter_file } = voterDoc.data()
  const expected = voter_file['DOB/YOB/Age Range']

  // Withhelds have an approx age range, rather than exact
  if (voter_file.is_withheld) {
    const [minYear, maxYear] = birthYearRangeFromAgeRange(expected)

    // If given year is outside of expected range:
    if (Number(yearOfBirth) < minYear || Number(yearOfBirth) > maxYear) {
      // Are they are Multi-Withheld Household, with distinct age ranges?
      const { distinct_age_ranges_index } = voter_file
      if (distinct_age_ranges_index) {
        const ageRangePartnerDocs = (
          await electionDoc
            .collection('voters')
            .where('voter_file.distinct_age_ranges_index', '==', distinct_age_ranges_index)
            .get()
        ).docs
        const [matchedAgeRangeInHouse] = ageRangePartnerDocs
          .map((v) => v.data())
          .filter((v) => {
            const { voter_file } = v
            const [partnerMinYear, partnerMaxYear] = birthYearRangeFromAgeRange(voter_file['DOB/YOB/Age Range'])

            const matchingRange = Number(yearOfBirth) >= partnerMinYear && Number(yearOfBirth) <= partnerMaxYear
            return matchingRange
          })

        if (matchedAgeRangeInHouse) {
          await Promise.all([
            // pushover(
            //   '11c/submit-yob: distinct_age_range PASS',
            //   JSON.stringify({
            //     auth_token,
            //     distinct_age_ranges_index,
            //     matched_to_instead: matchedAgeRangeInHouse.auth_token,
            //     submitted: yearOfBirth,
            //   }),
            // ),
            voterDoc.ref.update({
              YOB_passed: firestore.FieldValue.arrayUnion({
                matched_to_instead: matchedAgeRangeInHouse.auth_token,
                submitted: yearOfBirth,
                timestamp: new Date(),
              }),
            }),
          ])
          return res.status(200).json({ success: true })
        } else {
          await pushover(
            '11c/submit-yob: distinct_age_range fail — no matching age range in house',
            JSON.stringify({ auth_token, distinct_age_ranges_index, submitted: yearOfBirth, yearOfBirth }),
          )
        }
      }

      const expectedRange = `[${minYear}, ${maxYear}]`
      await Promise.all([
        // Ping admin
        pushover(
          '11c/YoB: WITHHELD range mismatch',
          `expected: ${expectedRange}   got: ${yearOfBirth}\n[${auth_token}] WITHHELD VOTER`,
        ),
        // Store mismatch in db
        voterDoc.ref.update({
          'YOB mismatch': firestore.FieldValue.arrayUnion({
            expected: expectedRange,
            submitted: yearOfBirth,
            timestamp: new Date(),
          }),
        }),
      ])
      return res.status(400).json({ error: "Doesn't match State Voter File" })
    }
  } else {
    // If wrong:
    if (String(expected) !== yearOfBirth) {
      await Promise.all([
        // Ping admin
        pushover(
          '11c/submit-yob: mismatch',
          `expected: ${String(expected)}   got: ${yearOfBirth}\n[${auth_token}] ${voter_file.first_name} ${
            voter_file.last_name
          }`,
        ),
        // Store mismatch in db
        voterDoc.ref.update({
          'YOB mismatch': firestore.FieldValue.arrayUnion({ expected, submitted: yearOfBirth, timestamp: new Date() }),
        }),
      ])
      // Return error to client
      return res.status(400).json({ error: "Doesn't match State Voter File" })
    }
  }

  // If correct:
  await voterDoc.ref.update({
    YOB_passed: firestore.FieldValue.arrayUnion({ submitted: yearOfBirth, timestamp: new Date() }),
  })

  return res.status(200).json({ success: true })
}

/** `birthYearRangeFromAgeRange('46 through 55')` → `[1969, 1979]` if called in 2025 */
const birthYearRangeFromAgeRange = (range: string) => {
  const currentYear = new Date().getFullYear()
  let [minAge, maxAge] = [Infinity, 0] // Init variables

  if (range.includes('or Younger')) {
    maxAge = parseInt(range.split(' or Younger')[0])
    minAge = 16
  } else {
    ;[minAge, maxAge] = range.split(' through ').map((a) => parseInt(a))
  }

  const earliest = currentYear - maxAge - 1 // oldest person: birthday may still be upcoming
  const latest = currentYear - minAge // youngest person: birthday already happened

  return [earliest, latest]
}
