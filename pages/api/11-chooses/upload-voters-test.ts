import { firebase } from 'api/_services'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { election_ids_for_11chooses } from 'src/vote/auth/11choosesAuth/CustomAuthFlow'

/* For each record (~62k): {
    auth_token ("voter code"): string
    voter_file: {
      distinct_age_ranges_index: integer | null
      'DOB/YOB/Age Range': string
      first_name: string
      is_withheld: boolean
      last_name: string
      multi_withheld_address_index: integer | null
      state_voter_id: string
      voter_file_index: integer
    }
} */

const sample_auth_tokens: Record<string, string> = { '1234567890': 'aabbccddee', w1: 'bbccddeeff', w2: 'ccddeeffaa' }
const sample_distinct_age_ranges_index: Record<string, number> = { w1: 0, w2: 0 }
const sample_multi_withheld_address_index: Record<string, number> = { w1: 3, w2: 3 }

// 1 Public, 2 Withheld
const sample_voters = [
  {
    'DOB/YOB/Age Range': '1970',
    'First Name': 'Alice',
    'Last Name': 'Smith',
    'Privacy Status': 'Public',
    'Voter ID': '1234567890',
  },
  {
    'DOB/YOB/Age Range': '46 through 55',
    'First Name': '',
    'Last Name': '',
    'Privacy Status': 'Withheld',
    'Voter ID': 'w1',
  },
  {
    'DOB/YOB/Age Range': '36 through 45',
    'First Name': '',
    'Last Name': '',
    'Privacy Status': 'Withheld',
    'Voter ID': 'w2',
  },
]

export const voterFileToUploadFormat = (v: (typeof sample_voters)[number], index: number) => ({
  auth_token: sample_auth_tokens[v['Voter ID']],
  voter_file: {
    distinct_age_ranges_index: sample_distinct_age_ranges_index[v['Voter ID']] || null,
    'DOB/YOB/Age Range': v['DOB/YOB/Age Range'],
    first_name: v['First Name'] || '',
    is_withheld: v['Privacy Status'] === 'Withheld',
    last_name: v['Last Name'] || '',
    multi_withheld_address_index: sample_multi_withheld_address_index[v['Voter ID']] || null,
    state_voter_id: v['Voter ID'],
    voter_file_index: index,
  },
})
// console.log(sample_voters.map(voterFileToUploadFormat))

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.headers.host?.startsWith('localhost:300')) return res.status(405).json({ error: 'For localhost only' })

  const { election_id } = req.query
  if (typeof election_id !== 'string') return res.status(400).json({ error: 'election_id is required' })
  if (!election_ids_for_11chooses.includes(election_id)) return res.status(400).json({ error: 'Invalid election_id' })

  const new_voter_uploads = sample_voters.map(voterFileToUploadFormat)

  // Download the current list of voters for the election
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const uploaded_voters = (
    await firebase.firestore().collection('elections').doc(election_id).collection('voters').get()
  ).docs.map((v) => ({ ...v.data() }))
  //   console.log(uploaded_voters)

  if (uploaded_voters.length > 1) return res.status(400).json({ error: 'Stopping to avoid uploading duplicates' })

  // Generate and store auths for uniques
  await Promise.all(
    new_voter_uploads
      .map((v: ReturnType<typeof voterFileToUploadFormat>, index: number) => {
        const email = `${index}${v.voter_file.is_withheld ? 'withheld' : ''}@upload1`
        return electionDoc
          .collection('voters')
          .doc(email)
          .set({
            ...v,
            added_at: new Date(),
            email,
            index: index + uploaded_voters.length,
          })
      })
      // Increment electionDoc's num_voters cached tally
      .concat(electionDoc.update({ num_voters: firestore.FieldValue.increment(new_voter_uploads.length) })),
  )

  return res.status(200).send('Success')
}
