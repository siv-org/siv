import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'
import { CipherStrings } from 'src/crypto/stringify-shuffle'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { auth_token, election_id } = req.query

  if (typeof election_id !== 'string') return res.status(400).json({ error: 'Missing election_id' })
  if (typeof auth_token !== 'string') return res.status(400).json({ error: 'Missing auth_token' })

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  // Fetch stored vote from database
  const votes = await electionDoc.collection('votes').where('auth', '==', auth_token).get()
  if (votes.empty) return res.status(404).json({ error: 'Vote not found' })

  const storedVote = votes.docs[0].data()
  const storedEncryptedVote = storedVote.encrypted_vote as Record<string, CipherStrings>

  return res.status(200).json({ encrypted_vote: storedEncryptedVote })
}
