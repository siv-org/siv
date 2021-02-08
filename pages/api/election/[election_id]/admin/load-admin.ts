import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'
import { QueueLog } from './invite-voters'

const { ADMIN_PASSWORD, MANAGER_PASSWORD } = process.env

export type Voter = {
  auth_token: string
  email: string
  esignature?: string
  has_voted: boolean
  index: number
  invite_queued?: QueueLog[]
  mailgun_events: { accepted?: MgEvent[]; delivered?: MgEvent[]; failed?: MgEvent[] }
}

type MgEvent = Record<string, unknown>

export type AdminData = {
  ballot_design?: string
  election_id?: string
  election_manager?: string
  election_title?: string
  esignature_requested?: boolean
  threshold_public_key?: string
  trustees?: string[]
  voters?: Voter[]
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id, password } = req.query as { election_id?: string; password?: string }

  // Check required params
  if (!election_id) return res.status(401).json({ error: `Missing election_id` })
  if (!password || ![ADMIN_PASSWORD, MANAGER_PASSWORD].includes(password))
    return res.status(401).json({ error: `Invalid Password: '${password}'` })

  // Only allow manager for whitelisted elections
  const manager_allowed = [
    '1611997618605', // Cache County Sample Election
    '1612028266931', // Cache County Executive Round 1
    '1612031971385', // Cache County Executive Round 2
    '1612033630381', // Cache County Executive Round 3
  ]
  if (password === MANAGER_PASSWORD && !manager_allowed.includes(election_id))
    return res.status(401).json({ error: `Manager not enabled for this election` })

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

  const { ballot_design, election_manager, election_title, esignature_requested, threshold_public_key } = {
    ...electionDoc.data(),
  } as {
    ballot_design?: string
    election_manager?: string
    election_title?: string
    esignature_requested?: boolean
    threshold_public_key?: string
  }

  // Build array of trustees emails
  const trustees = (await loadTrustees).docs.reduce((acc: string[], doc) => [...acc, { ...doc.data() }.email], [])

  // Gather who's voted already
  const votesByAuth: Record<string, [boolean, string?]> = (await loadVotes).docs.reduce((acc, doc) => {
    const data = doc.data()
    return { ...acc, [data.auth]: [true, data.esignature] }
  }, {})

  // Build voters objects
  const voters: Voter[] = (await loadVoters).docs.reduce((acc: Voter[], doc) => {
    const { auth_token, email, index, invite_queued, mailgun_events } = { ...doc.data() } as {
      auth_token: string
      email: string
      index: number
      invite_queued: QueueLog[]
      mailgun_events: { accepted: MgEvent[]; delivered: MgEvent[] }
    }
    return [
      ...acc,
      {
        auth_token,
        email,
        esignature: (votesByAuth[auth_token] || [])[1],
        has_voted: !!votesByAuth[auth_token],
        index,
        invite_queued,
        mailgun_events,
      },
    ]
  }, [])

  return res.status(200).send({
    ballot_design,
    election_id,
    election_manager,
    election_title,
    esignature_requested,
    threshold_public_key,
    trustees,
    voters,
  } as AdminData)
}
