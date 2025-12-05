import { createSession } from 'api/_passportreaderapp'
import { firebase, pushover } from 'api/_services'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { election_ids_for_11chooses } from 'src/vote/auth/11choosesAuth/CustomAuthFlow'

export default async function createPassportUrl(req: NextApiRequest, res: NextApiResponse) {
  const { election_id, link_auth } = req.body
  if (typeof election_id !== 'string') return res.status(400).json({ error: 'election_id is required' })
  if (!election_ids_for_11chooses.includes(election_id)) return res.status(400).json({ error: 'Invalid election_id' })
  if (!link_auth) return res.status(400).json({ error: 'link_auth is required' })

  const session = createSession()

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  // Lookup provisional vote by link_auth
  const [voterDoc] = (await electionDoc.collection('votes-pending').where('link_auth', '==', link_auth).get()).docs
  // If not found, error and ping admin
  if (!voterDoc?.exists) {
    await pushover('11c/create-passport-url: link_auth not found', JSON.stringify({ link_auth }))
    return res.status(400).json({ error: 'provisional ballot not found' })
  }

  const { id, token } = await session

  // Store session in db
  await voterDoc.ref.update({
    passport_sessions: firestore.FieldValue.arrayUnion({ id, timestamp: new Date(), token }),
  })

  return res.status(200).json({ id, token })
}
