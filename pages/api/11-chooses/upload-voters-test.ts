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

console.log(sample_voters.map(voterFileToUploadFormat))
