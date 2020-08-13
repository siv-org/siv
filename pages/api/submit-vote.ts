import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover } from '../../src/admin/services'
import { validateAuthToken } from './check-auth-token'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { authToken, electionId, encryptedString } = req.body

  // 1. Validate auth token
  let validated = false
  await validateAuthToken(authToken, electionId, {
    fail: (message) => res.status(400).end(message),
    pass: () => (validated = true),
  })
  // Stop if validation failed
  if (!validated) {
    return pushover('SIV submission: Auth Token failure', ' ')
  }

  // 2. Store the encrypted vote in db
  firebase
    .firestore()
    .collection('elections')
    .doc(electionId)
    .collection('votes')
    .add({ authToken, created_at: new Date(), encryptedString, headers: req.headers })

  // 3. TODO Email the voter their submission receipt
  // const link = `www.secureinternetvoting.org/demo-election-results`

  //   await mailgun.messages().send({
  //     from: 'SIV Admin <admin@secureinternetvoting.org>',
  //     html: `Your vote has been received. Thank you.

  // The final results will be posted at <a href="${link}">${link}</a> when the election closes.

  // Here is the encrypted vote you submitted:

  // <code style="margin: 0 30px;">${JSON.stringify(authToken)}</code>

  // <em style="font-size:10px">If you did not submit this ballot, <a>click here</a> to report a problem.</em>`.replace(
  //       /\n/g,
  //       '<br />',
  //     ),
  //     subject: 'Vote Confirmation',
  //     to: 'admin@secureinternetvoting.org',
  //   })

  res.status(200).end('Success.')
}
