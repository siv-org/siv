import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'
import { QueueLog } from './invite-voters'

const { ADMIN_PASSWORD } = process.env

export type Voter = {
  auth_token: string
  email: string
  has_voted: boolean
  invite_queued?: QueueLog[]
  mailgun_events: { accepted?: MgEvent[]; delivered?: MgEvent[]; failed?: MgEvent[] }
}

type MgEvent = Record<string, unknown>

export type LoadAdminResponse = {
  ballot_design?: string
  election_id?: string
  election_manager?: string
  election_title?: string
  threshold_public_key?: string
  trustees?: string[]
  voters?: Voter[]
}

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

  const { ballot_design, election_manager, election_title, threshold_public_key } = { ...electionDoc.data() } as {
    ballot_design?: string
    election_manager?: string
    election_title?: string
    threshold_public_key?: string
  }

  // Build array of trustees emails
  const trustees = (await loadTrustees).docs.reduce((acc: string[], doc) => [...acc, { ...doc.data() }.email], [])

  // Gather who's voted already
  const votesByAuth: Record<string, boolean> = (await loadVotes).docs.reduce(
    (acc, doc) => ({ ...acc, [doc.data().auth]: true }),
    {},
  )

  // Build voters objects
  const voters: Voter[] = (await loadVoters).docs.reduce((acc: Voter[], doc) => {
    const { auth_token, email, invite_queued, mailgun_events } = { ...doc.data() } as {
      auth_token: string
      email: string
      invite_queued: QueueLog[]
      mailgun_events: { accepted: MgEvent[]; delivered: MgEvent[] }
    }
    return [...acc, { auth_token, email, has_voted: !!votesByAuth[auth_token], invite_queued, mailgun_events }]
  }, [])

  return res.status(200).send({
    ballot_design,
    election_id,
    election_manager,
    election_title,
    threshold_public_key,
    trustees,
    voters,
  } as LoadAdminResponse)
}
