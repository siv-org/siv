import { firebase, pushover } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'
import { test_election_id_11chooses as election_id, VoterInfo } from 'src/vote/auth/11choosesAuth/CustomAuthFlow'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Validate auth_token
  const { auth_token } = req.body
  if (typeof auth_token !== 'string') return res.status(400).json({ error: 'auth_token is required' })

  // Lookup voter by auth_token
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const [voter] = (await electionDoc.collection('voters').where('auth_token', '==', auth_token).get()).docs

  // If voter not found, error and ping admin
  if (!voter?.exists) {
    await pushover('11chooses/get-voter-auth: auth not found', JSON.stringify({ auth_token }))
    return res.status(400).json({ error: 'voter not found' })
  }

  // Send name to client
  const { voter_file } = voter.data()
  const { first_name, last_name } = voter_file
  const voterInfo: VoterInfo = { voterName: first_name + ' ' + last_name }

  return res.status(200).json(voterInfo)
}
