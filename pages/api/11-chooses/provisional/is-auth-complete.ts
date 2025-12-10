// Did the voter successfully complete auth?

import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'
import { election_ids_for_11chooses } from 'src/vote/auth/11choosesAuth/CustomAuthFlow'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // Get & validate query params
  const { election_id, link_auth } = req.query
  if (typeof election_id !== 'string') return res.status(400).json({ error: 'election_id is required' })
  if (!election_ids_for_11chooses.includes(election_id)) return res.status(400).json({ error: 'Invalid election_id' })
  if (!link_auth) return res.status(400).json({ error: 'link_auth is required' })

  // Lookup provisional vote by link_auth
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const [voterDoc] = (await electionDoc.collection('votes-pending').where('link_auth', '==', link_auth).get()).docs
  if (!voterDoc?.exists) return res.status(400).json({ error: 'provisional ballot not found' })

  // Check is_auth_complete status
  const { is_auth_complete } = voterDoc.data() ?? { is_auth_complete: false }

  return res.status(200).json({ is_auth_complete })
}
