import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from './_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { auth, election_id } = req.body

  await validateAuthToken(auth, election_id, {
    fail: (message) => res.status(400).end(message),
    pass: (message) => res.status(200).end(message),
  })
}

type Response = (message: string) => void

export async function validateAuthToken(
  auth: string,
  election_id: string,
  { fail, pass }: { fail: Response; pass: Response },
) {
  // Did they send us an Auth Token?
  if (!auth) {
    return fail('Missing Auth Token. Only registered voters are allowed to vote.')
  }

  // Is Auth token malformed?
  if (!/^[0-9a-f]{10}$/.test(auth)) {
    return fail('Malformed Auth Token.')
  }

  // Did they send us an Election ID?
  if (!election_id) {
    return fail('Missing Election ID.')
  }

  // Is election_id in DB?
  const election = firebase.firestore().collection('elections').doc(election_id)
  if (!(await election.get()).exists) {
    return fail('Unknown Election ID.')
  }

  // Is Auth token in DB?
  const [auth_token_doc] = (await election.collection('voters').where('auth_token', '==', auth).get()).docs
  if (!auth_token_doc) {
    return fail('Invalid Auth Token.')
  }

  // Has Auth Token been used yet?
  const [vote_doc] = (await election.collection('votes').where('auth', '==', auth).get()).docs
  if (vote_doc) {
    return fail('Auth Token already used.')
  }

  // TODO Has Auth Token been invalidated?

  // Passed all checks
  pass('Your Voter Auth Token is valid.')
}
