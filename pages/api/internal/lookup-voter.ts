// /api/internal/lookup-voter
//
// (election_id, auth_token) => email + vote metadata
//
// localhost:3000/api/internal/lookup-voter?election_id=YOUR_ELECTION_ID&auth_token=YOUR_10_CHAR_HEX&pass=your-secret-here

import type { DocumentData } from 'firebase-admin/firestore'

import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'

const { INTERNAL_VOTER_LOOKUP_PASS } = process.env

type LookupVoterResult = {
  election: {
    creator?: string
    election_title?: string
    exists: boolean
    id: string
    stop_accepting_votes?: boolean
    voter_applications_allowed?: boolean
  }
  related: {
    votes: Array<{ doc_id: string; summary: Record<string, unknown> }>
    votes_pending: Array<{ doc_id: string; summary: Record<string, unknown> }>
    votes_rejected: Array<{ doc_id: string; summary: Record<string, unknown> }>
  }
  voter: null | {
    data: Record<string, unknown>
    doc_id: string
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Restrict to localhost-only
  if (!isLocalhostRequest(req)) return res.status(403).json({ error: 'localhost only' })

  // Check server for missing password
  if (!INTERNAL_VOTER_LOOKUP_PASS)
    return res.status(501).json({ error: 'Server missing process.env.INTERNAL_VOTER_LOOKUP_PASS' })

  // Validate query params: pass, election_id, auth_token
  const { auth_token, election_id, pass } = req.query
  if (typeof pass !== 'string' || pass !== INTERNAL_VOTER_LOOKUP_PASS)
    return res.status(401).json({ error: 'Bad password' })
  if (typeof election_id !== 'string' || !election_id) return res.status(400).json({ error: 'election_id is required' })
  if (typeof auth_token !== 'string' || !auth_token) return res.status(400).json({ error: 'auth_token is required' })
  if (!/^[0-9a-f]{10}$/.test(auth_token)) return res.status(400).json({ error: 'auth_token must be 10 hex characters' })

  // Lookup election info
  const electionRef = firebase.firestore().collection('elections').doc(election_id)
  const electionSnap = await electionRef.get()
  if (!electionSnap.exists) return res.status(404).json({ error: 'Election not found' })
  const electionData = electionSnap.data()
  const election = {
    creator: electionData?.creator as string | undefined,
    election_title: electionData?.election_title as string | undefined,
    exists: electionSnap.exists,
    id: election_id,
    stop_accepting_votes: electionData?.stop_accepting_votes as boolean | undefined,
    voter_applications_allowed: electionData?.voter_applications_allowed as boolean | undefined,
  }

  // Lookup voter & votes
  const [voterQuery, votesByAuth, rejectedByAuth, pendingByDoc, voteByDoc, rejectedByDoc] = await Promise.all([
    electionRef.collection('voters').where('auth_token', '==', auth_token).get(),
    electionRef.collection('votes').where('auth', '==', auth_token).get(),
    electionRef.collection('votes-rejected').where('auth', '==', auth_token).get(),
    electionRef.collection('votes-pending').doc(auth_token).get(),
    electionRef.collection('votes').doc(auth_token).get(),
    electionRef.collection('votes-rejected').doc(auth_token).get(),
  ])

  const [voterDoc] = voterQuery.docs
  const voter = voterDoc ? { data: voterDataForJson(voterDoc.data()), doc_id: voterDoc.id } : null

  const votes = votesByAuth.docs.map((d) => ({ doc_id: d.id, summary: summarizeDoc(d.data()) }))
  const votes_rejected = rejectedByAuth.docs.map((d) => ({ doc_id: d.id, summary: summarizeDoc(d.data()) }))

  if (voteByDoc.exists && !votes.some((v) => v.doc_id === voteByDoc.id))
    votes.push({ doc_id: voteByDoc.id, summary: summarizeDoc(voteByDoc.data()) })
  if (rejectedByDoc.exists && !votes_rejected.some((v) => v.doc_id === rejectedByDoc.id))
    votes_rejected.push({ doc_id: rejectedByDoc.id, summary: summarizeDoc(rejectedByDoc.data()) })

  const votes_pending: Array<{ doc_id: string; summary: Record<string, unknown> }> = []
  if (pendingByDoc.exists) votes_pending.push({ doc_id: pendingByDoc.id, summary: summarizeDoc(pendingByDoc.data()) })

  // Return results
  return res
    .status(200)
    .json({ election, related: { votes, votes_pending, votes_rejected }, voter } as LookupVoterResult)
}

function deepSerializeFirestore(o: unknown): unknown {
  if (isFirestoreTimestamp(o)) return o.toDate().toISOString()
  if (Array.isArray(o)) return o.map(deepSerializeFirestore)
  if (o !== null && typeof o === 'object' && !(o instanceof Date))
    return Object.fromEntries(
      Object.entries(o as Record<string, unknown>).map(([k, v]) => [k, deepSerializeFirestore(v)]),
    )
  return o
}

function isFirestoreTimestamp(v: unknown): v is { toDate: () => Date } {
  return (
    typeof v === 'object' && v !== null && 'toDate' in v && typeof (v as { toDate?: unknown }).toDate === 'function'
  )
}

function isLocalhostRequest(req: NextApiRequest): boolean {
  const addr = req.socket.remoteAddress
  if (!addr) return false
  return addr === '127.0.0.1' || addr === '::1' || addr === '::ffff:127.0.0.1'
}

/** JSON-safe view; strips large vote payloads */
function summarizeDoc(data: DocumentData | undefined): Record<string, unknown> {
  if (!data) return {}
  const out: Record<string, unknown> = {}
  for (const key of Object.keys(data)) {
    const v = data[key]
    if (key === 'encrypted_vote') {
      out[key] = v != null ? '[present]' : undefined
      continue
    }
    if (key === 'headers') {
      out[key] = v != null ? '[present]' : undefined
      continue
    }
    if (isFirestoreTimestamp(v)) {
      out[key] = v.toDate().toISOString()
      continue
    }
    if (v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)) {
      out[key] = '[object]'
      continue
    }
    out[key] = v as unknown
  }
  return out
}

function voterDataForJson(data: DocumentData | undefined): Record<string, unknown> {
  if (!data) return {}
  return deepSerializeFirestore(data) as Record<string, unknown>
}
