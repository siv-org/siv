import { NextApiRequest, NextApiResponse } from 'next'
import UAParser from 'ua-parser-js'

import { firebase } from '../../../_services'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'
import { QueueLog } from './invite-voters'

export type AdminData = {
  ballot_design?: string
  ballot_design_finalized?: boolean
  custom_invitation_text?: string
  election_id?: string
  election_manager?: string
  election_title?: string
  esignature_requested?: boolean
  notified_unlocked?: number
  pending_votes?: PendingVote[]
  stop_accepting_votes?: boolean
  threshold_public_key?: string
  trustees?: Trustee[]
  voter_applications_allowed?: boolean
  voters?: Voter[]
}

export type PendingVote = {
  created_at: Date
  email?: string
  first_name?: string
  is_email_verified: boolean
  last_name?: string
  link_auth: string
}

export type ReviewLog = { review: 'approve' | 'reject' }

export type Trustee = {
  device?: string
  email: string
  mailgun_events: { accepted?: MgEvent[]; delivered?: MgEvent[]; failed?: MgEvent[] }
  name?: string
  stage: number
}

export type Voter = {
  auth_token: string
  email: string
  esignature?: string
  esignature_review: ReviewLog[]
  first_name: string
  has_voted: boolean
  index: number
  invalidated?: boolean
  invite_queued?: QueueLog[]
  is_email_verified?: boolean
  last_name: string
  mailgun_events: { accepted?: MgEvent[]; delivered?: MgEvent[]; failed?: MgEvent[] }
}

type MgEvent = Record<string, unknown>

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id?: string }

  // Check required params
  if (!election_id) return res.status(401).json({ error: `Missing election_id` })

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  const election = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin preloading all these docs
  const loadElection = election.get()
  const loadTrustees = election.collection('trustees').orderBy('index', 'asc').get()
  const loadVoters = election.collection('voters').orderBy('index', 'asc').get()
  const loadVotes = election.collection('votes').get()
  const loadPendingVotes = election.collection('votes-pending').get()
  const loadInvalidatedVotes = election.collection('invalidated_votes').get()

  // Is election_id in DB?
  const electionDoc = await loadElection
  if (!electionDoc.exists) return res.status(400).json({ error: `Unknown Election ID: '${election_id}'` })

  const {
    ballot_design,
    ballot_design_finalized,
    custom_invitation_text,
    election_manager,
    election_title,
    esignature_requested,
    notified_unlocked,
    stop_accepting_votes,
    threshold_public_key,
    voter_applications_allowed,
  } = {
    ...electionDoc.data(),
  } as {
    ballot_design?: string
    ballot_design_finalized?: boolean
    custom_invitation_text?: string
    election_manager?: string
    election_title?: string
    esignature_requested?: boolean
    notified_unlocked?: number
    stop_accepting_votes?: boolean
    threshold_public_key?: string
    voter_applications_allowed?: boolean
  }

  // Build trustees objects
  const trustees = (await loadTrustees).docs.reduce((acc: Trustee[], doc, _, docs) => {
    const has_everyone = (obj: Record<string, string>) => Object.keys(obj).length === docs.length - 1
    const data = { ...doc.data() }

    let stage = 0
    if (data.recipient_key) stage = 4
    if (data.commitments) stage = 5
    if (data.encrypted_pairwise_shares_for && has_everyone(data.encrypted_pairwise_shares_for)) stage = 7
    if (data.verified && has_everyone(data.verified)) stage = 8
    if (data.partial_decryption) stage = 12

    let device = ''
    if (data.headers) {
      const ua = UAParser(data.headers['user-agent'])
      device = `${ua.browser.name} ${ua.browser.version} on ${ua.os.name} ${ua.os.version}`
    }

    return [
      ...acc,
      {
        device,
        email: data.email,
        mailgun_events: data.mailgun_events,
        name: data.name,
        stage,
      },
    ]
  }, [])

  // Gather who's voted already
  const votesByAuth: Record<string, [boolean, string?]> = (await loadVotes).docs.reduce((acc, doc) => {
    const data = doc.data()
    return { ...acc, [data.auth]: [true, data.esignature] }
  }, {})

  // Gather whose votes were invalidated
  const invalidatedVotesByAuth: Record<string, boolean> = {}
  ;(await loadInvalidatedVotes).docs.forEach((doc) => {
    const data = doc.data()
    invalidatedVotesByAuth[data.auth] = true
  })

  // Build voters objects
  const voters: Voter[] = (await loadVoters).docs.reduce((acc: Voter[], doc) => {
    const {
      auth_token,
      email,
      esignature_review,
      first_name,
      index,
      invalidated_at,
      invite_queued,
      is_email_verified,
      last_name,
      mailgun_events,
    } = {
      ...doc.data(),
    } as {
      auth_token: string
      email: string
      esignature_review: ReviewLog[]
      first_name: string
      index: number
      invalidated_at?: Date
      invite_queued: QueueLog[]
      is_email_verified?: boolean
      last_name: string
      mailgun_events: { accepted: MgEvent[]; delivered: MgEvent[] }
    }
    return [
      ...acc,
      {
        auth_token,
        email,
        esignature: (votesByAuth[auth_token] || [])[1],
        esignature_review,
        first_name,
        has_voted: !!votesByAuth[auth_token] || !!invalidatedVotesByAuth[auth_token],
        index,
        invalidated: invalidated_at ? true : undefined,
        invite_queued,
        is_email_verified,
        last_name,
        mailgun_events,
      },
    ]
  }, [])

  // Build pending votes
  const pending_votes: PendingVote[] = (await loadPendingVotes).docs.map((doc) => {
    const { created_at, email, first_name, is_email_verified, last_name, link_auth } = doc.data() as {
      created_at: { _seconds: number }
      email?: string
      first_name?: string
      is_email_verified: boolean
      last_name?: string
      link_auth: string
    }
    return {
      created_at: new Date(created_at._seconds * 1000),
      email,
      first_name,
      is_email_verified,
      last_name,
      link_auth,
    }
  })

  return res.status(200).send({
    ballot_design,
    ballot_design_finalized,
    custom_invitation_text,
    election_id,
    election_manager,
    election_title,
    esignature_requested,
    notified_unlocked,
    pending_votes,
    stop_accepting_votes,
    threshold_public_key,
    trustees,
    voter_applications_allowed,
    voters,
  } as AdminData)
}
