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

  // Mark election as closed
  election.update({ closed_at: new Date() })

  res.status(201).end()
}
