import { firebase, pushover, sendEmail } from 'api/_services'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { encodeInvalidationResponsePayload, is64HexChars, is128HexChars, verifyReplacement } from 'src/crypto/voter-key'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { auth, message, signature } = req.body
  const election_id = req.query.election_id

  // Validate req params
  if (!election_id || typeof election_id !== 'string') return res.status(400).json({ error: 'Missing Election ID' })
  if (!auth || typeof auth !== 'string') return res.status(400).json({ error: 'Missing auth' })
  if (!message || typeof message !== 'string') return res.status(400).json({ error: 'Missing message' })
  if (!is128HexChars(signature)) return res.status(400).json({ error: 'Missing or malformed cryptographic signature' })

  // Get election doc and votes
  const election = firebase.firestore().collection('elections').doc(election_id)

  const votes = await election.collection('invalidated_votes').where('auth', '==', auth).get()
  if (!votes.docs.length) return res.status(404).json({ error: 'No invalidated vote w/ this auth_token' })

  const vote = votes.docs[0].data()

  // Validate voter's cryptographic signature
  const { voter_pubkey } = vote
  if (!is64HexChars(voter_pubkey)) {
    await pushover(
      'Invalidated vote has no voter_pubkey; cannot authorize response',
      `election: ${election_id}\nauth: ${auth}`,
    )
    return res.status(400).json({ error: 'Vote has no voter_pubkey; cannot authorize response' })
  }

  if (
    !(await verifyReplacement(
      voter_pubkey,
      signature,
      encodeInvalidationResponsePayload({ auth, election_id, message }),
    ))
  )
    return res.status(401).json({ error: 'Invalid cryptographic signature' })

  // Begin preloading
  const electionDoc = election.get()
  const loadVoters = election.collection('voters').where('auth_token', '==', auth).get()
  await Promise.all(
    votes.docs.map((vote) =>
      vote.ref.update({ responses: firestore.FieldValue.arrayUnion({ message, timestamp: new Date() }) }),
    ),
  )

  // Send admin email
  const voter = (await loadVoters).docs[0].data()
  const electionData = (await electionDoc).data()

  await sendEmail({
    bcc: 'admin@siv.org',
    recipient: electionData?.creator,
    subject: 'Invalidated Vote: Voter Response',
    text: `You have received a message from a voter whose vote you invalidated.

    Election Title: ${electionData?.election_title}
    Election ID: ${election_id}

    Voter details:
    - Auth token: ${voter.auth_token}
    - Email: ${voter.email}
    - First Name: ${voter.first_name || 'Not provided'}
    - Last Name:  ${voter.last_name || 'Not provided'}

    Their message below:

    <hr />
    
    ${message}
    `,
  })

  return res.status(200).json({ message: 'Message received' })
}
