import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'
import { generateAuthToken } from '../../../invite-voters'

const { ADMIN_PASSWORD } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { new_voters, password } = req.body
  const { election_id } = req.query as { election_id: string }

  // Check for required params
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid Password.' })
  if (!election_id) return res.status(401).json({ error: 'Missing election_id' })

  // Generate auth token for each voter
  const auth_tokens = new_voters.map(() => generateAuthToken())

  // Get existing voter from DB
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const loadVoters = electionDoc.collection('voters').get()
  const existing_voters = new Set()
  ;(await loadVoters).docs.map((d) => existing_voters.add(d.data().email))

  // Separate uniques from already_added
  const unique_new_voters: string[] = []
  const already_added: string[] = []
  new_voters.forEach((v: string) => {
    if (v) {
      existing_voters.has(v) ? already_added.push(v) : unique_new_voters.push(v)
    }
  })

  console.log({ already_added, unique_new_voters })

  // Add uniques to DB
  await Promise.all(
    unique_new_voters.map((voter: string, index: number) =>
      electionDoc
        .collection('voters')
        .doc(voter)
        .set({
          added_at: new Date(),
          auth_token: auth_tokens[index],
          email: voter,
          index: index + existing_voters.size,
        }),
    ),
  )

  return res.status(201).json({ already_added, unique_new_voters })
}
