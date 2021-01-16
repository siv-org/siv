/* eslint-disable prefer-const */
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from './_services'

const { ADMIN_PASSWORD } = process.env

const election_id = '1610822485943'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { password } = req.query

  return res.json({ message: 'disabled' })

  // Check for password
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid Password.' })

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  const { election_title } = (await electionDoc.get()).data() as { election_title?: string }

  // Get all voters
  const all_voters = (await electionDoc.collection('voters').get()).docs.map((d) => {
    const data = { ...d.data() }
    return `${data.email}, ${data.auth_token}`
  })

  const result = all_voters.join('\n')

  await res.send(result)
}
