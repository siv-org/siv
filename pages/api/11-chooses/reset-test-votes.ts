import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'

const election_id = '1764391039716' // 11_chooses Test Auth

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.headers.host !== 'localhost:3001') return res.status(405).json({ error: 'For localhost only' })

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  // Delete vote docs
  const votes = await electionDoc.collection('votes').get()
  await Promise.all(votes.docs.map((v) => v.ref.delete()))

  // Reset num_votes counter
  await electionDoc.update({ num_votes: 0 })

  return res.status(200).json({ message: 'Successfully reset votes', timestamp: new Date().toISOString() })
}
