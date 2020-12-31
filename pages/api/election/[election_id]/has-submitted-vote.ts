const { ADMIN_PASSWORD } = process.env

import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id, password } = req.query
  if (password !== ADMIN_PASSWORD) return res.status(401).send('Invalid Password.')

  const electionDoc = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin preloading these docs
  const loadVoters = electionDoc.collection('voters').get()
  const loadVotes = electionDoc.collection('votes').get()

  // Is election_id in DB?
  if (!(await electionDoc.get()).exists) return res.status(400).send('Unknown Election ID.')

  // Grab voters list for indices
  const voters_by_auth: Record<string, { index: number }> = (await loadVoters).docs.reduce((memo, doc) => {
    const data = doc.data()
    return { ...memo, [data.auth_token]: data }
  }, {})

  // Build array of who submitted their vote already
  const submitted = (await loadVotes).docs.reduce((memo, doc) => {
    const data = doc.data()
    const { index } = voters_by_auth[data.auth]
    memo[index] = true
    return memo
  }, new Array(Object.keys(voters_by_auth).length))

  res.status(200).json(submitted)
}
