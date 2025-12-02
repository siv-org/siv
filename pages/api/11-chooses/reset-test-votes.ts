import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'
import { election_ids_for_11chooses } from 'src/vote/auth/11choosesAuth/CustomAuthFlow'

const { RECENT_ELECTIONS_PASSWORD } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Confirm they have password
  if (!RECENT_ELECTIONS_PASSWORD) return res.status(401).send('Server missing process.env.RECENT_ELECTIONS_PASSWORD')
  if (req.query.pass !== RECENT_ELECTIONS_PASSWORD) return res.status(401).send('Unauthorized')

  if (!req.headers.host?.startsWith('localhost:300')) return res.status(405).json({ error: 'For localhost only' })

  const { election_id } = req.query
  if (typeof election_id !== 'string') return res.status(400).json({ error: 'election_id is required' })
  if (!election_ids_for_11chooses.includes(election_id)) return res.status(400).json({ error: 'Invalid election_id' })

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  // Delete vote docs
  const votes = await electionDoc.collection('votes').get()
  await Promise.all(votes.docs.map((v) => v.ref.delete()))

  // Reset num_votes counter
  await electionDoc.update({ num_votes: 0 })

  return res.status(200).json({ message: 'Successfully reset votes', timestamp: new Date().toISOString() })
}
