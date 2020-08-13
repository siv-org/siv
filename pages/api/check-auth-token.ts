import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../src/admin/services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { authToken, electionId } = req.body

  await validateAuthToken(authToken, electionId, {
    fail: (message) => res.status(400).end(message),
    pass: (message) => res.status(200).end(message),
  })
}

type Response = (message: string) => void

export async function validateAuthToken(
  authToken: string,
  electionId: string,
  { fail, pass }: { fail: Response; pass: Response },
) {
  // Did they send us an Auth Token?
  if (!authToken) {
    return fail('Missing Auth Token.')
  }

  // Is Auth token malformed?
  if (!/^[0-9a-f]{10}$/.test(authToken)) {
    return fail('Malformed Auth Token.')
  }

  // Did they send us an Election ID?
  if (!electionId) {
    return fail('Missing Election ID.')
  }

  // Is electionId in DB?
  const election = firebase.firestore().collection('elections').doc(electionId)
  if (!(await election.get()).exists) {
    return fail('Unknown Election ID.')
  }

  // Is Auth token in DB?
  const [auth_token_doc] = (await election.collection('voters').where('auth_token', '==', authToken).get()).docs
  if (!auth_token_doc) {
    return fail('Invalid Auth Token.')
  }

  // TODO Has Auth Token been used yet?

  // TODO Has Auth Token been invalidated?

  // Passed all checks
  pass('Your Voter Auth Token is valid.')
}
