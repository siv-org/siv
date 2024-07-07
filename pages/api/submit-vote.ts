import { validate as validateEmail } from 'email-validator'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { generateAuthToken } from 'src/crypto/generate-auth-tokens'
import { CipherStrings } from 'src/crypto/stringify-shuffle'

import { EncryptedVote, stringifyEncryptedVote } from '../../src/status/AcceptedVotes'
import { firebase, pushover, sendEmail } from './_services'
import { validateAuthToken } from './check-auth-token'
import { pusher } from './pusher'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const payload = req.method === 'POST' ? req.body : req.query
  const { auth, election_id } = payload
  let { encrypted_vote } = payload
  if (typeof encrypted_vote === 'string') encrypted_vote = JSON.parse(encrypted_vote)

  // return res.status(200).json({ auth, election_id, encrypted_vote })

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  // Handle auth='link' submissions
  if (auth === 'link') {
    // Does this election reject 'link' submissions?
    const election = { ...(await electionDoc.get()).data() }
    if (!election.voter_applications_allowed) return res.status(400).json({ error: 'Votes via link not allowed' })

    // Create a unique link_auth token for this vote
    const link_auth = generateAuthToken()

    // Store in db as 'votes-pending'
    await Promise.all([
      // 2a. Store the encrypted vote in db
      electionDoc
        .collection('votes-pending')
        .doc(link_auth)
        .set({ created_at: new Date(), encrypted_vote, headers: req.headers, link_auth }),
      // 2b. Update election's cached tally of num_votes
      electionDoc.update({ num_pending_votes: firestore.FieldValue.increment(1) }),
    ])

    // Link to the auth url, particularly for AirgappedVoters
    const host = req.headers.host
    const protocol = host?.startsWith('localhost') ? 'http://' : 'https://'
    const visit_to_add_auth = `${protocol}${host}/election/${election_id}/auth?link=${link_auth}`

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
        electionDoc
          .collection('votes-rejected')
          .add({ auth, created_at: new Date(), encrypted_vote, headers: req.headers, rejection: message }),
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

  await Promise.all([
    // 2a. Store the encrypted vote in db
    electionDoc.collection('votes').add({ auth, created_at: new Date(), encrypted_vote, headers: req.headers }),
    // 2b. Update elections cached tally of num_votes
    electionDoc.update({ num_votes: firestore.FieldValue.increment(1) }),
  ])

  // 3. Email the voter their submission receipt
  const { email } = (await voter).docs[0].data()
  const promises: Promise<unknown>[] = []

  // Skip if email isn't valid (e.g. used QR invitations)
  if (validateEmail(email)) {
    const link = `${req.headers.origin || req.headers.host}/election/${election_id}`
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
      }),
    )
  }

  promises.push(pusher.trigger(`status-${election_id}`, 'votes', auth))

  await Promise.all(promises)

  res.status(200).send('Success.')
}

const buildSubmissionReceipt = (auth: string, encrypted_vote: Record<string, CipherStrings>) =>
  Buffer.from(`
============================
Encrypted Submission Receipt
============================

This is the encrypted vote you submitted.

You can confirm it matches your private Encryption Details by revisiting your vote invitation link on the same voting device.

${stringifyEncryptedVote({ auth, ...encrypted_vote } as EncryptedVote)}
`)
