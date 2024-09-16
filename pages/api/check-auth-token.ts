import { NextApiRequest, NextApiResponse } from 'next'
import { exampleAuthToken } from 'src/vote/EnterAuthToken'
import { format } from 'timeago.js'

import { firebase, pushover } from './_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { auth, election_id } = req.body

  await validateAuthToken(auth, election_id, {
    fail: (message) => res.status(400).send(message),
    pass: (message) => res.status(200).send(message),
  })
}

type Response = (message: string) => void

export async function validateAuthToken(
  auth: string,
  election_id: string,
  { fail, pass }: { fail: Response; pass: Response },
) {
  // Begin preloading these docs
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const election = electionDoc.get()
  const voters = electionDoc.collection('approved-voters').where('auth_token', '==', auth).get()

  // Did they send us an Auth Token?
  if (!auth) return fail('Missing Auth Token. Only registered voters are allowed to vote.')

  // Is Auth token malformed?
  if (!/^[0-9a-f]{10}$/.test(auth)) return fail('Malformed Auth Token.')

  // Did they send us an Election ID?
  if (!election_id) return fail('Missing Election ID.')

  // Is election_id in DB?
  if (!(await election).exists) return fail('Unknown Election ID. It may have been deleted.')

  if ((await election).data()?.stop_accepting_votes)
    return fail('The election administrator has stopped accepting new votes.')

  // Is there a voter w/ this Auth Token?
  const [voter] = (await voters).docs
  if (!voter) {
    if (auth !== exampleAuthToken)
      await pushover(
        'SIV auth token lookup miss',
        `election: ${election_id}\nbad auth: ${auth}\nPossible brute force attack?`,
      )

    return fail('Invalid Auth Token.')
  }

  // Has Auth Token already been used?
  if (voter.data().voted_at) {
    const previous_at = new Date(voter.data().voted_at?._seconds * 1000)
    return fail(`Vote already recorded. (${format(previous_at)})`)
  }

  // Has Auth Token been invalidated?
  if (voter.data().invalidated_at) return fail('This voter authorization token was invalidated.')

  // Passed all checks
  pass('Your Voter Authorization Token is valid.')
}
