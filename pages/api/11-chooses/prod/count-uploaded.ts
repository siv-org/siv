import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'
import { election_ids_for_11chooses } from 'src/vote/auth/11choosesAuth/CustomAuthFlow'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.headers.host?.startsWith('localhost:300')) return res.status(405).json({ error: 'For localhost only' })

  const { batchId, election_id } = req.query
  if (typeof election_id !== 'string') return res.status(400).json({ error: 'election_id is required' })
  if (!election_ids_for_11chooses.includes(election_id)) return res.status(400).json({ error: 'Invalid election_id' })

  const db = firebase.firestore()
  const baseQuery = db
    .collection('elections')
    .doc(election_id)
    .collection('voters')
    .where('importBatchId', '==', batchId)

  // TODO: Not supposed in firebase-admin v9. Requires v12.
  // const aggQuery = await baseQuery.count().get()
  // return aggQuery.data().count
  void baseQuery
  return res.status(400).json({ error: 'Not implemented' })
}
