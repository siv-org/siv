import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { CipherStrings } from 'src/crypto/stringify-shuffle'

import { EncryptedVote, stringifyEncryptedVote } from '../../src/status/AcceptedVotes'
import { firebase, pushover, sendEmail } from './_services'
import { validateAuthToken } from './check-auth-token'
import { pusher } from './pusher'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { auth, election_id, encrypted_vote } = req.body

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

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
  const link = `${req.headers.origin}/election/${election_id}`
  const { email } = (await voter).docs[0].data()
  const { election_manager } = (await election).data() as {
    election_manager?: string
    election_title?: string
  }

  const promises: Promise<unknown>[] = []

  // TEMPORARY for 2022-02-12 demo vid script
  if (!(email.includes('demo-voter-') && email.includes('@siv.org'))) {
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
