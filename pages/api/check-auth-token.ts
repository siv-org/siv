import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../src/admin/services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { authToken, electionId } = req.body

  // Did they send us an Auth Token?
  if (!authToken) {
    return res.status(400).end('Missing Auth Token.')
  }

  // Is Auth token malformed?
  if (!/^[0-9a-f]{10}$/.test(authToken)) {
    return res.status(401).end('Malformed Auth Token.')
  }

  // Did they send us an Election ID?
  if (!electionId) {
    return res.status(400).end('Missing Election ID.')
  }

  // Is electionId in DB?
  const election = firebase.firestore().collection('elections').doc(electionId)
  if (!(await election.get()).exists) {
    return res.status(401).end('Unknown Election ID.')
  }

  // Is Auth token in DB?
  const [auth_token_doc] = (await election.collection('voters').where('auth_token', '==', authToken).get()).docs
  if (!auth_token_doc) {
    return res.status(401).end('Invalid Auth Token.')
  }

  // TODO Has Auth Token been used yet?

  // TODO Has Auth Token been invalidated?

  // Passed all checks
  res.status(200).end('Your Voter Auth Token is valid.')
}
