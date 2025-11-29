import { firebase } from 'api/_services'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

/* For each record (~62k): {
    auth_token ("voter code"): string
    voter_file: {
      voter_file_index: integer
      state_voter_id: string
      is_withheld: boolean
      'DOB/YOB/Age Range': string
      first_name: string
      last_name: string
    }
} */

const sample_auth_tokens_by_voter_id: Record<string, string> = { '1234567890': 'aabbccddee', withheld1: 'bbccddeeff' }

// 1 Public, 1 Withheld
const sample_voters = [
  {
    'DOB/YOB/Age Range': '1970',
    'First Name': 'Alice',
    'Last Name': 'Smith',
    'Privacy Status': 'Public',
    'Voter ID': '1234567890',
  },
  {
    'DOB/YOB/Age Range': '60-70',
    'First Name': '',
    'Last Name': '',
    'Privacy Status': 'Withheld',
    'Voter ID': 'withheld1',
  },
]

const voterFileToUploadFormat = (v: (typeof sample_voters)[number], index: number) => ({
  auth_token: sample_auth_tokens_by_voter_id[v['Voter ID']],
  voter_file: {
    'DOB/YOB/Age Range': v['DOB/YOB/Age Range'],
    first_name: v['First Name'],
    is_withheld: v['Privacy Status'] === 'Withheld',
    last_name: v['Last Name'],
    state_voter_id: v['Voter ID'],
    voter_file_index: index,
  },
})
// console.log(sample_voters.map(voterFileToUploadFormat))

const election_id = '1764391039716' // 11_chooses Test Auth

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.headers.host !== 'localhost:3000') return res.status(405).json({ error: 'For localhost only' })

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
        const email = `${index + 1}@upload1`
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
