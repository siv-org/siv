const { ADMIN_PASSWORD } = process.env

import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id, password } = req.query
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).end('Invalid Password.')
  }

  const election = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Is election_id in DB?
  if (!(await election.get()).exists) {
    return res.status(400).end('Unknown Election ID.')
  }

  // Grab voters list for indices
  const voters_by_auth: Record<string, { index: number }> = (await election.collection('voters').get()).docs.reduce(
    (memo, doc) => {
      const data = doc.data()
      return { ...memo, [data.auth_token]: data }
    },
    {},
  )

  // Build array of who submitted their vote already
  const submitted = (await election.collection('votes').get()).docs.reduce((memo, doc) => {
    const data = doc.data()
    const { index } = voters_by_auth[data.auth]
    memo[index] = true
    return memo
  }, new Array(Object.keys(voters_by_auth).length))

  res.status(200).json(submitted)
}
