import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { safeOrigin } from 'src/_shared/safeOrigin'

import { firebase, pushover } from '../../_services'
import { resetVotesCache } from './cache-accepted'

export type VoteTimeBucket = {
  accepted: number
  pending: number
  t: number // Hour bucket start (UTC ms)
}

type PackedTimes = { created_at?: number }

const HOUR_MS = 60 * 60 * 1000

const hourStart = (ms: number) => Math.floor(ms / HOUR_MS) * HOUR_MS

const docCreatedAtMs = (doc: firestore.QueryDocumentSnapshot) => {
  const t = doc.get('created_at') as Date | undefined | { toMillis?: () => number }
  if (t instanceof Date) return t.getTime()
  return t?.toMillis?.()
}

async function readPackedTimes(electionDoc: firestore.DocumentReference) {
  const pages = await electionDoc
    .collection('votes-cached')
    .doc('root')
    .collection('pages')
    .orderBy(firestore.FieldPath.documentId())
    .get()

  const accepted: PackedTimes[] = []
  const pending: PackedTimes[] = []
  for (const page of pages.docs) {
    const data = page.data() as { pendingVotes?: PackedTimes[]; votes?: PackedTimes[] }
    if (Array.isArray(data.votes)) accepted.push(...data.votes)
    if (Array.isArray(data.pendingVotes)) pending.push(...data.pendingVotes)
  }
  return { accepted, pending }
}

/**
Public projection of turnout over time.

Privacy: only hour buckets leave this endpoint — not exact created_at times.

Reads votes-cached pages (same pack as /cache-accepted). Legacy packs without
created_at are reset once; packing itself stays in /cache-accepted (we hit it to
rebuild rather than duplicating the packer here).
*/
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query
  if (!election_id || typeof election_id !== 'string') return res.status(400).json({ error: 'Missing election_id' })

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const election = await electionDoc.get()
  if (!election.exists) return res.status(400).json({ error: 'Unknown Election ID.' })

  let { accepted, pending } = await readPackedTimes(electionDoc)
  const packed = [...accepted, ...pending]

  // Caches built before Nov '26 didn't have timestamps, need re-packing
  const isPackMissingTimestamps = packed.length > 0 && packed.some((v) => typeof v.created_at !== 'number')

  // Or if no one has asked for the cache before, it might not have been packed yet
  const num_votes = (election.data()?.num_votes as number | undefined) ?? 0
  const neverPacked = packed.length === 0 && num_votes > 0

  if (isPackMissingTimestamps || neverPacked) {
    if (isPackMissingTimestamps) await resetVotesCache(electionDoc)

    // Let /cache-accepted build us a fresh cache
    const origin = safeOrigin(req)
    if (typeof origin === 'string')
      await fetch(`${origin}/api/election/${election_id}/cache-accepted`).catch(() => undefined)
    ;({ accepted, pending } = await readPackedTimes(electionDoc))
  }

  // If still empty after pack attempt: live query so the chart still works + pushover alert
  if (accepted.length + pending.length === 0 && num_votes > 0) {
    await pushover(
      '/votes-over-time: live query fallback',
      `[${election_id}] cache empty after pack attempt; num_votes=${num_votes}`,
    )
    const [votesSnap, pendingSnap] = await Promise.all([
      electionDoc.collection('votes').select('created_at').get(),
      electionDoc.collection('votes-pending').select('created_at').get(),
    ])
    accepted = votesSnap.docs.map((doc) => ({ created_at: docCreatedAtMs(doc) }))
    pending = pendingSnap.docs.map((doc) => ({ created_at: docCreatedAtMs(doc) }))
  }

  // Otherwise we're in the happy path, build our buckets
  const buckets = new Map<number, { accepted: number; pending: number }>()
  const add = (ms: number | undefined, key: 'accepted' | 'pending') => {
    if (!ms) return
    const t = hourStart(ms)
    const row = buckets.get(t) || { accepted: 0, pending: 0 }
    row[key] += 1
    buckets.set(t, row)
  }
  for (const v of accepted) add(v.created_at, 'accepted')
  for (const v of pending) add(v.created_at, 'pending')

  const sorted: VoteTimeBucket[] = Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([t, counts]) => ({ t, ...counts }))

  // Short CDN cache — underlying pack already absorbs most vote-doc reads
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=3600')

  return res.status(200).json({
    buckets: sorted,
    election_title: election.data()?.election_title ?? null,
    totals: {
      accepted: accepted.length,
      pending: pending.length,
    },
  })
}
