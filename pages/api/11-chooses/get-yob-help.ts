import { firebase, pushover } from 'api/_services'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { election_ids_for_11chooses } from 'src/vote/auth/11choosesAuth/CustomAuthFlow'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Validate request body
  const { auth_token, contactInfoForHelp, election_id } = req.body
  if (typeof auth_token !== 'string') return res.status(400).json({ error: 'auth_token is required' })
  if (typeof election_id !== 'string') return res.status(400).json({ error: 'election_id is required' })
  if (!election_ids_for_11chooses.includes(election_id)) return res.status(400).json({ error: 'Invalid election_id' })

  // Lookup voter by auth_token
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const [voterDoc] = (await electionDoc.collection('voters').where('auth_token', '==', auth_token).get()).docs

  // If voter not found, error and ping admin
  if (!voterDoc?.exists) {
    await pushover('11c/get-yob-help: auth not found', JSON.stringify({ auth_token }))
    return res.status(400).json({ error: 'voter not found' })
  }

  const { voter_file } = voterDoc.data()

  // If found, store & ping admin:
  await Promise.all([
    pushover(
      '11c: asked for YoB help',
      `[${auth_token}] ${voter_file.first_name} ${voter_file.last_name} (${voter_file['DOB/YOB/Age Range']})\nContact: ${contactInfoForHelp}`,
    ),
    voterDoc.ref.update({
      asked_for_help: firestore.FieldValue.arrayUnion({ contactInfoForHelp, timestamp: new Date() }),
    }),
  ])

  return res.status(200).json({ success: true })
}
