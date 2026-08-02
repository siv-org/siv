import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { encodeReplacementPayload, is64HexChars, is128HexChars, verifyReplacement } from 'src/crypto/replacement-key'
import { CipherStrings } from 'src/crypto/stringify-shuffle'

import { firebase } from './_services'
import { withApiErrorLogs } from './_with-api-error-logs'
import { invalidateCachedVote } from './election/[election_id]/cache-accepted'

export default withApiErrorLogs(async (req: NextApiRequest, res: NextApiResponse) => {
  // Validate body
  const { auth, election_id, encrypted_vote, signature } = req.body || {}
  if (!election_id || typeof election_id !== 'string') return res.status(400).json({ error: 'Missing Election ID' })
  if (!auth || typeof auth !== 'string') return res.status(400).json({ error: 'Missing auth' })
  if (!encrypted_vote || typeof encrypted_vote !== 'object')
    return res.status(400).json({ error: 'Missing encrypted_vote' })
  if (!is128HexChars(signature)) return res.status(400).json({ error: 'Missing or malformed signature' })

  // Load election
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const election = await electionDoc.get()
  if (!election.exists) return res.status(400).json({ error: 'Unknown Election ID' })
  if (election.data()?.stop_accepting_votes)
    return res.status(400).json({ error: 'The election administrator has stopped accepting new votes.' })

  // Find existing vote (accepted first, then pending/link)
  let voteSnap = await electionDoc.collection('votes').where('auth', '==', auth).limit(1).get()
  if (voteSnap.empty)
    voteSnap = await electionDoc.collection('votes-pending').where('link_auth', '==', auth).limit(1).get()
  if (voteSnap.empty) return res.status(404).json({ error: 'No vote found for this auth' })

  // Require device replacement pubkey from original submit
  const voteDoc = voteSnap.docs[0]
  const vote = voteDoc.data()
  const { replacement_pubkey } = vote
  if (!is64HexChars(replacement_pubkey))
    return res.status(400).json({ error: 'Vote has no replacement_pubkey; cannot authorize replace' })

  // Verify signature over the new encrypted_vote
  const message = encodeReplacementPayload({
    auth,
    election_id,
    encrypted_vote: encrypted_vote as Record<string, CipherStrings>,
  })
  if (!(await verifyReplacement(replacement_pubkey, signature, message)))
    return res.status(401).json({ error: 'Invalid replacement signature' })

  // Archive prior ciphertext, swap in the new one, keep votes cache fresh
  const replaced_at = new Date()
  const pending = voteDoc.ref.parent.id === 'votes-pending'
  await Promise.all([
    voteDoc.ref.update({
      encrypted_vote,
      previous_submissions: firestore.FieldValue.arrayUnion({
        encrypted_vote: vote.encrypted_vote,
        replaced_at,
        ...(vote.created_at && { created_at: vote.created_at }),
        ...(vote.strengthened_at && { strengthened_at: vote.strengthened_at }),
      }),
      strengthened_at: replaced_at,
    }),

    // Ensure /cache-accepted serves the latest ciphertext
    invalidateCachedVote(electionDoc, {
      auth,
      created_at: vote.created_at,
      encrypted_vote,
      pending,
      vote_doc_id: voteDoc.id,
    }),
  ])

  return res.status(200).json({ success: true })
})
