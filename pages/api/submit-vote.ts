import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover, sendEmail } from './_services'
import { validateAuthToken } from './check-auth-token'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { auth, election_id, encrypted_vote } = req.body

  // 1. Validate auth token
  let validated = false
  await validateAuthToken(auth, election_id, {
    fail: (message) => res.status(400).end(message),
    pass: () => (validated = true),
  })
  // Stop if validation failed
  if (!validated) {
    return pushover('SIV submission: Auth Token failure', ' ')
  }

  const election = firebase.firestore().collection('elections').doc(election_id)

  // 2. Store the encrypted vote in db
  await election.collection('votes').add({ auth, created_at: new Date(), encrypted_vote, headers: req.headers })

  // 3. Email the voter their submission receipt
  const link = `${req.headers.origin}/election/${election_id}`
  const { email } = (await election.collection('voters').where('auth_token', '==', auth).get()).docs[0].data()

  await sendEmail({
    recipient: email,
    subject: 'Vote Confirmation',
    text: `Your vote has been received. Thank you.

  The final results will be posted at <a href="${link}">${link}</a> when the election closes.

  Here is the encrypted vote you submitted:

  <code style="margin: 0 30px;">${JSON.stringify({ auth, best_icecream: encrypted_vote })}</code>

  <em style="font-size:10px">If you did not submit this ballot, hit reply to report a problem.</em>`,
  })

  res.status(200).end('Success.')
}
