import { NextApiRequest, NextApiResponse } from 'next'
import UAParser from 'ua-parser-js'

import { firebase } from '../../../_services'
import { checkJwt } from '../../../validate-admin-jwt'
import { QueueLog } from './invite-voters'

export type ReviewLog = { review: 'approve' | 'reject' }

export type Voter = {
  auth_token: string
  email: string
  esignature?: string
  esignature_review: ReviewLog[]
  has_voted: boolean
  index: number
  invalidated?: boolean
  invite_queued?: QueueLog[]
  mailgun_events: { accepted?: MgEvent[]; delivered?: MgEvent[]; failed?: MgEvent[] }
}
export type Trustee = {
  device?: string
  email: string
  mailgun_events: { accepted?: MgEvent[]; delivered?: MgEvent[]; failed?: MgEvent[] }
  name?: string
  stage: number
}

type MgEvent = Record<string, unknown>

export type AdminData = {
  ballot_design?: string
  ballot_design_finalized?: boolean
  election_id?: string
  election_manager?: string
  election_title?: string
  esignature_requested?: boolean
  notified_unlocked?: number
  threshold_public_key?: string
  trustees?: Trustee[]
  voters?: Voter[]
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id?: string }

  // Check required params
  if (!election_id) return res.status(401).json({ error: `Missing election_id` })

  // Confirm they're a valid admin
  if (!checkJwt(req, res).valid) return

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

  const {
    ballot_design,
    ballot_design_finalized,
    election_manager,
    election_title,
    esignature_requested,
    notified_unlocked,
    threshold_public_key,
  } = {
    ...electionDoc.data(),
  } as {
    ballot_design?: string
    ballot_design_finalized?: boolean
    election_manager?: string
    election_title?: string
    esignature_requested?: boolean
    notified_unlocked?: number
    threshold_public_key?: string
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

  // Build voters objects
  const voters: Voter[] = (await loadVoters).docs.reduce((acc: Voter[], doc) => {
    const { auth_token, email, esignature_review, index, invalidated_at, invite_queued, mailgun_events } = {
      ...doc.data(),
    } as {
      auth_token: string
      email: string
      esignature_review: ReviewLog[]
      index: number
      invalidated_at?: Date
      invite_queued: QueueLog[]
      mailgun_events: { accepted: MgEvent[]; delivered: MgEvent[] }
    }
    return [
      ...acc,
      {
        auth_token,
        email,
        esignature: (votesByAuth[auth_token] || [])[1],
        esignature_review,
        has_voted: !!votesByAuth[auth_token],
        index,
        invalidated: invalidated_at ? true : undefined,
        invite_queued,
        mailgun_events,
      },
    ]
  }, [])

  return res.status(200).send({
    ballot_design,
    ballot_design_finalized,
    election_id,
    election_manager,
    election_title,
    esignature_requested,
    notified_unlocked,
    threshold_public_key,
    trustees,
    voters,
  } as AdminData)
}
