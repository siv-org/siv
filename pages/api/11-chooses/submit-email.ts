import { firebase, pushover } from 'api/_services'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { test_election_id_11chooses as election_id } from 'src/vote/auth/11choosesAuth/CustomAuthFlow'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Validate request body
  const { auth_token, email } = req.body
  if (typeof auth_token !== 'string') return res.status(400).json({ error: 'auth_token is required' })
  if (typeof email !== 'string') return res.status(400).json({ error: 'email is required' })

  // Lookup voter by auth_token
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const [voterDoc] = (await electionDoc.collection('voters').where('auth_token', '==', auth_token).get()).docs

  // If voter not found, error and ping admin
  if (!voterDoc?.exists) {
    await pushover('11chooses/submit-email: auth not found', JSON.stringify({ auth_token }))
    return res.status(400).json({ error: 'voter not found' })
  }

  // Store in db
  await voterDoc.ref.update({
    email_submitted: firestore.FieldValue.arrayUnion({ email, timestamp: new Date() }),
  })

  // Return success
  return res.status(200).json({ success: true })
}
