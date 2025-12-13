import { firebase, pushover } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'
import { election_ids_for_11chooses, VoterInfo } from 'src/vote/auth/11choosesAuth/CustomAuthFlow'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { auth_token, election_id } = req.body
  if (typeof auth_token !== 'string') return res.status(400).json({ error: 'auth_token is required' })
  if (typeof election_id !== 'string') return res.status(400).json({ error: 'election_id is required' })
  if (!election_ids_for_11chooses.includes(election_id)) return res.status(400).json({ error: 'Invalid election_id' })
  if (auth_token === 'link') return res.status(400).json({ error: 'Looking up auth=link not supported' })

  // Lookup voter by auth_token
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const [voter] = (await electionDoc.collection('voters').where('auth_token', '==', auth_token).get()).docs

  // If voter not found, error and ping admin
  if (!voter?.exists) {
    await pushover('11c/get-voter-auth: auth not found', JSON.stringify({ auth_token }))
    return res.status(400).json({ error: 'voter not found' })
  }

  const voterData = voter.data() || {}

  // Send name + auth progress flags to client
  const { voter_file } = voterData
  const { first_name = 'FirstNameMissing', is_withheld, last_name = 'LastNameMissing' } = voter_file || {}

  // YoB step considered "passed" if we've ever stored a successful YOB_passed entry
  const passed_yob = Array.isArray(voterData.YOB_passed) && voterData.YOB_passed.length > 0

  // Email step considered "submitted" if we've ever stored an email_submitted entry
  const passed_email = Array.isArray(voterData.email_submitted) && voterData.email_submitted.length > 0

  const voterInfo: VoterInfo = {
    is_withheld,
    passed_email,
    passed_yob,
    voterName: first_name + ' ' + last_name,
  }

  return res.status(200).json(voterInfo)
}
