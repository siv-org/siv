import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover } from './_services'

const { ADMIN_PASSWORD } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { password } = req.query

  // *** EDIT THESE ***
  const election_id = ''
  const voter_to_invalidate = ''
  // ******************

  if (!election_id) return res.status(404).json({ error: 'Missing election_id' })

  // 1. Check for password
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid Password.' })

  // This will hold all our async tasks
  const promises: Promise<unknown>[] = []

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  const loadVotes = electionDoc.collection('votes').get()
  const loadVoter = electionDoc.collection('voters').doc(voter_to_invalidate).get()
  const election = { ...(await electionDoc.get()).data() }

  const { election_title } = election

  const existing_voter = { ...(await loadVoter).data() }
  if (!existing_voter) return res.status(404).json({ error: `Can't find voter ${voter_to_invalidate}` })

  // Has the voter already voted?
  const vote = (await loadVotes).docs
    .map((doc) => ({ ...(doc.data() as { auth: string }), id: doc.id }))
    .find(({ auth }) => auth === existing_voter.auth)

  if (!vote) console.log({ existing_voter })

  electionDoc.collection('voters').doc(voter_to_invalidate)

  // 5. Send Admin push notification
  promises.push(pushover(`Invalidated voter`, voter_to_invalidate))

  await Promise.all(promises)

  return res.status(201).json({ message: `Invalidated voter ${voter_to_invalidate} from ${election_title}` })
}
