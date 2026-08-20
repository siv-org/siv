import { NextApiRequest, NextApiResponse } from 'next'
import { encodeEsignaturePayload, is64HexChars, is128HexChars, verifyReplacement } from 'src/crypto/voter-key'

import { firebase, pushover } from './_services'
import { pusher } from './pusher'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { auth, election_id, esignature, signature } = req.body

  if (!election_id || typeof election_id !== 'string') return res.status(400).json({ error: 'Missing Election ID' })
  if (!auth || typeof auth !== 'string') return res.status(400).json({ error: 'Missing auth' })
  if (!esignature || typeof esignature !== 'string') return res.status(400).json({ error: 'Missing esignature' })
  if (!is128HexChars(signature)) return res.status(400).json({ error: 'Missing or malformed cryptographic signature' })

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  // Is there an encrypted vote w/ this auth token?
  let [voteDoc] = (await electionDoc.collection('votes').where('auth', '==', auth).get()).docs
  if (!voteDoc?.exists) {
    ;[voteDoc] = (await electionDoc.collection('votes-pending').where('link_auth', '==', auth).get()).docs
    if (!voteDoc?.exists) return res.status(404).json({ error: 'No vote w/ this auth_token' })
  }
  const vote = voteDoc.data()
  // Without an existing esignature?
  if (vote.esignature) return res.status(400).json({ error: 'Vote already has an esignature' })

  const { voter_pubkey } = vote
  if (!is64HexChars(voter_pubkey)) {
    await pushover('Vote has no voter_pubkey; cannot authorize esignature', `election: ${election_id}\nauth: ${auth}`)
    return res.status(400).json({ error: 'Vote has no voter_pubkey; cannot authorize esignature' })
  }

  if (!(await verifyReplacement(voter_pubkey, signature, encodeEsignaturePayload({ auth, election_id, esignature }))))
    return res.status(401).json({ error: 'Invalid cryptographic signature' })

  await voteDoc.ref.update({ esignature, esigned_at: new Date() })

  await pusher.trigger(`status-${election_id}`, 'votes', auth)

  return res.status(200).send('Success.')
}
