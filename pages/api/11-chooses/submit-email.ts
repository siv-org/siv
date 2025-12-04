import { firebase, pushover } from 'api/_services'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { election_ids_for_11chooses } from 'src/vote/auth/11choosesAuth/CustomAuthFlow'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Validate request body
  const { auth_token, election_id, email, link_auth } = req.body
  if (typeof auth_token !== 'string') return res.status(400).json({ error: 'auth_token is required' })
  if (typeof email !== 'string') return res.status(400).json({ error: 'email is required' })
  if (typeof election_id !== 'string') return res.status(400).json({ error: 'election_id is required' })
  if (!election_ids_for_11chooses.includes(election_id)) return res.status(400).json({ error: 'Invalid election_id' })

  // Lookup voter by auth_token
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  let voterDoc: firestore.DocumentSnapshot<firestore.DocumentData> | null = null

  // Provisional ballots store their votes a bit differently
  if (auth_token === 'provisional') {
    // Error if missing link_auth
    if (!link_auth) {
      await pushover('11c/submit-email: link_auth missing', JSON.stringify({ link_auth }))
      return res.status(400).json({ error: 'link_auth is required for provisional ballots' })
    }

    // Lookup provisional vote by link_auth
    ;[voterDoc] = (await electionDoc.collection('votes-pending').where('link_auth', '==', link_auth).get()).docs

    // If not found, error and ping admin
    if (!voterDoc?.exists) {
      await pushover('11c/submit-email: link_auth not found', JSON.stringify({ link_auth }))
      return res.status(400).json({ error: 'provisional ballot not found' })
    }
  } else {
    ;[voterDoc] = (await electionDoc.collection('voters').where('auth_token', '==', auth_token).get()).docs

    // If voter not found, error and ping admin
    if (!voterDoc?.exists) {
      await pushover('11c/submit-email: auth not found', JSON.stringify({ auth_token }))
      return res.status(400).json({ error: 'voter not found' })
    }
  }

  // Store in db
  await voterDoc.ref.update({
    email_submitted: firestore.FieldValue.arrayUnion({ email, timestamp: new Date() }),
  })

  // Return success
  return res.status(200).json({ success: true })
}
