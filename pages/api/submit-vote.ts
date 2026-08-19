import { validate as validateEmail } from 'email-validator'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { safeOrigin } from 'src/_shared/safeOrigin'
import { generateAuthToken } from 'src/crypto/generate-auth-tokens'
import { CipherStrings } from 'src/crypto/stringify-shuffle'
import { is64HexChars } from 'src/crypto/voter-key'
import { EncryptedVote } from 'src/status/AcceptedVotes'

import { firebase, pushover, sendEmail } from './_services'
import { withApiErrorLogs } from './_with-api-error-logs'
import { validateAuthToken } from './check-auth-token'
import { pusher } from './pusher'

export default withApiErrorLogs(async (req: NextApiRequest, res: NextApiResponse) => {
  const payload = req.method === 'POST' ? req.body : req.query
  const { auth, election_id, embed = '', voter_pubkey } = payload
  if (!election_id) return res.status(400).json({ error: 'Missing Election ID' })
  if (embed) await pushover('Submitted Vote w/ embed', `election: ${election_id}\nembed: ${embed}\nauth: ${auth}`)

  let { encrypted_vote } = payload
  if (typeof encrypted_vote === 'string') encrypted_vote = JSON.parse(encrypted_vote)

  if (!is64HexChars(voter_pubkey)) return res.status(400).json({ error: 'Missing or malformed voter_pubkey' })

  const origin = safeOrigin(req)
  if (typeof origin !== 'string') return res.status(500).json(origin)

  // return res.status(200).json({ auth, election_id, encrypted_vote })

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  // Handle auth='link' submissions
  if (auth === 'link') {
    // Does this election reject 'link' submissions?
    const election = { ...(await electionDoc.get()).data() }
    if (!election.voter_applications_allowed) return res.status(400).json({ error: 'Votes via link not allowed' })

    // Create a unique link_auth token for this vote
    const link_auth = generateAuthToken()

    // Did this election stop accepting votes?
    if (election.stop_accepting_votes) {
      const message = 'The election administrator has stopped accepting new votes.'

      await Promise.all([
        electionDoc.collection('votes-rejected').doc(link_auth).set({
          auth,
          created_at: firestore.FieldValue.serverTimestamp(),
          encrypted_vote,
          headers: req.headers,
          link_auth,
          rejection: message,
          voter_pubkey,
        }),
        pushover('Link submission when closed', `election: ${election_id}\nauth: ${auth}\nmessage: ${message}`),
      ])
      return res.status(400).json({ error: message })
    }

    // Store in db as 'votes-pending'
    await Promise.all([
      // 2a. Store the encrypted vote in db
      electionDoc.collection('votes-pending').doc(link_auth).set({
        created_at: firestore.FieldValue.serverTimestamp(),
        embed,
        encrypted_vote,
        headers: req.headers,
        link_auth,
        voter_pubkey,
      }),
      // 2b. Update election's cached tally of num_votes
      electionDoc.update({
        most_recent_vote_at: firestore.FieldValue.serverTimestamp(),
        num_pending_votes: firestore.FieldValue.increment(1),
        num_votes: firestore.FieldValue.increment(1),
      }),

      // 2c. Trigger admin's dashboard update
      pusher.trigger(`status-${election_id}`, 'votes', auth),
    ])

    // Link to the auth url, particularly for AirgappedVoters
    const visit_to_add_auth = `${origin}/election/${election_id}/auth?link=${link_auth}`

    return res.status(200).json({
      link_auth,
      message: 'Submission received',
      visit_to_add_auth,
    })
  }

  // 1. Validate auth token
  let validated = false
  await validateAuthToken(auth, election_id, {
    fail: async (message) => {
      await Promise.all([
        electionDoc.collection('votes-rejected').add({
          auth,
          created_at: firestore.FieldValue.serverTimestamp(),
          encrypted_vote,
          headers: req.headers,
          rejection: message,
          voter_pubkey,
        }),
        pushover('SIV submission: Bad Auth Token', `election: ${election_id}\nauth: ${auth}\nmessage: ${message}`),
      ])
      res.status(400).json({ error: message })
    },
    pass: () => (validated = true),
  })
  // Stop if validation failed
  if (!validated) return

  // Begin preloading
  const voter = electionDoc.collection('voters').where('auth_token', '==', auth).get()
  const election = electionDoc.get()

  // 2a. Store the encrypted vote in db
  try {
    // create() enforces uniqueness, to prevent a TOCTOU race-condition
    await electionDoc.collection('votes').doc(auth).create({
      auth,
      created_at: firestore.FieldValue.serverTimestamp(),
      encrypted_vote,
      headers: req.headers,
      voter_pubkey,
    })
  } catch (error) {
    // Doc present → lost the race / already voted. Absent → write failed (network, etc.).
    // Either way, keep a votes-rejected trail.
    const isDocAlreadyPresent = await electionDoc
      .collection('votes')
      .doc(auth)
      .get()
      .then((d) => d.exists)
      .catch(() => false)
    const rejection = isDocAlreadyPresent
      ? 'Vote already recorded.'
      : `Vote write failed: ${error instanceof Error ? error.message : String(error)}`

    await Promise.all([
      electionDoc.collection('votes-rejected').add({
        auth,
        created_at: firestore.FieldValue.serverTimestamp(),
        encrypted_vote,
        headers: req.headers,
        rejection,
        voter_pubkey,
      }),
      pushover(
        `SIV submission: ${isDocAlreadyPresent ? 'duplicate auth (race on create)' : 'vote write failed'}`,
        `election: ${election_id}\nauth: ${auth}\n${rejection}`,
      ),
    ]).catch(() => {}) // logging shouldn't block the client response

    if (isDocAlreadyPresent) return res.status(400).json({ error: 'Vote already recorded.' })
    return res.status(500).json({ error: 'Vote submission failed. Please try again.' })
  }

  // 2b. Update election's cached tally of num_votes (only after create succeeds)
  await electionDoc.update({ num_votes: firestore.FieldValue.increment(1) })

  // 3. Email the voter their submission receipt
  const { email } = (await voter).docs[0].data()
  const promises: Promise<unknown>[] = []

  // Skip if email isn't valid (e.g. used QR invitations)
  if (validateEmail(email)) {
    const link = `${origin}/election/${election_id}`
    const { election_manager } = (await election).data() as {
      election_manager?: string
      election_title?: string
    }

    promises.push(
      sendEmail({
        attachment: { data: buildSubmissionReceipt(auth, encrypted_vote), filename: 'receipt.txt' },
        from: election_manager,
        recipient: email,
        subject: 'Vote Confirmation',
        text: `<h2 style="margin: 0">Your vote was successfully submitted.</h2>
  The tallied results will be posted at <a href="${link}">${link}</a> when the election closes.

  For your records, your encrypted vote is attached.

  <em style="font-size:13px">You can press reply if you have a problem.</em>`,
      }).catch((error) => {
        console.error('Error sending submission receipt email', error)
        return Promise.resolve()
      }),
    )
  }

  promises.push(pusher.trigger(`status-${election_id}`, 'votes', auth))

  await Promise.all(promises)

  return res.status(200).send('Success.')
})

const buildSubmissionReceipt = (auth: string, encrypted_vote: Record<string, CipherStrings>) =>
  Buffer.from(`
============================
Encrypted Submission Receipt
============================

This is the encrypted vote you submitted.

You can confirm it matches your private Encryption Details by revisiting your vote invitation link on the same voting device.

${stringifyEncryptedVote({ auth, ...encrypted_vote } as EncryptedVote)}
`)

const stringifyEncryptedVote = (vote: EncryptedVote) =>
  `{ auth: ${vote.auth}${Object.keys(vote)
    .map((key) =>
      key === 'auth' ? '' : `, ${key}: { encrypted: '${vote[key].encrypted}', lock: '${vote[key].lock}' }`,
    )
    .join('')} }`
