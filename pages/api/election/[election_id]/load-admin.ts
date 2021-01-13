import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../_services'

const { ADMIN_PASSWORD } = process.env

export type Voters = [string, boolean][]

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id, password } = req.query

  // Check admin password
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: `Invalid Password: '${password}'` })

  const election = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin preloading all these docs
  const loadElection = election.get()
  const loadTrustees = election.collection('trustees').orderBy('index', 'asc').get()
  const loadVoters = election.collection('voters').orderBy('index', 'asc').get()
  const loadVotes = election.collection('votes').get()

  // Is election_id in DB?
  const electionDoc = await loadElection
  if (!electionDoc.exists) return res.status(400).json({ error: `Unknown Election ID: '${election_id}'` })

  const { ballot_design, threshold_public_key } = { ...electionDoc.data() } as {
    ballot_design?: string
    threshold_public_key?: string
  }

  // Build array of trustees emails
  const trustees = (await loadTrustees).docs.reduce((acc: string[], doc) => [...acc, { ...doc.data() }.email], [])

  // Gather who's voted already
  const votesByAuth: Record<string, boolean> = (await loadVotes).docs.reduce(
    (acc, doc) => ({ ...acc, [doc.data().auth]: true }),
    {},
  )

  // Build voters tuple array [email, has_voted][]
  const voters: Voters = (await loadVoters).docs.reduce((acc: Voters, doc) => {
    const { auth_token, email } = { ...doc.data() } as { auth_token: string; email: string }
    return [...acc, [email, !!votesByAuth[auth_token]]]
  }, [])

  return res.status(200).send({ ballot_design, election_id, threshold_public_key, trustees, voters })
}
