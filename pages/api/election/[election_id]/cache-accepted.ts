import type { NextApiRequest, NextApiResponse } from 'next'

import { createHash, randomBytes, randomUUID } from 'crypto'
import { firestore } from 'firebase-admin'
import { CipherStrings } from 'src/crypto/stringify-shuffle'

import { firebase, pushover } from '../../_services'

type EncryptedVote = Record<string, CipherStrings>
type PendingVoteSummary = EncryptedVote & { auth: 'pending' }
type RootMeta = {
  etagSeed: string
  lastPackedCreatedAt: firestore.Timestamp | null
  lastPackedDocId: null | string
  nextPageNum: number
  observedPending: number
  observedVotes: number
  packedPending: number
  packedVotes: number
  updatedAt: firestore.Timestamp | null
}
type Summary = PendingVoteSummary | VoteSummary
type VoteSummary = EncryptedVote & { auth: string }

const seconds = 1000
const PACK_THROTTLE_MS = 5 * seconds
const LEASE_TTL_MS = 15 * seconds
const KB = 1024
const MAX_PAGE_BYTES = 850 * KB

const approxBytes = (v: unknown) => Buffer.byteLength(JSON.stringify(v), 'utf8')

const setCachingHeaders = (res: NextApiResponse, etag: string) => {
  res.setHeader('ETag', etag)
  res.setHeader('Cache-Control', 'public, max-age=0')
  res.setHeader('CDN-Cache-Control', 'public, s-maxage=60, stale-while-revalidate=86400')
}

const makeEtag = (root: RootMeta) => {
  const seed = [
    root.etagSeed,
    root.nextPageNum,
    root.lastPackedCreatedAt?.toMillis() ?? 0,
    root.lastPackedDocId ?? '',
  ].join('|')

  return createHash('sha1').update(seed).digest('hex').slice(0, 12)
}

const mapVoteDoc = (doc: firestore.QueryDocumentSnapshot) => {
  const { auth, encrypted_vote } = doc.data()
  return { auth, ...encrypted_vote } as VoteSummary
}

const mapPendingVoteDoc = (doc: firestore.QueryDocumentSnapshot) => {
  const { encrypted_vote } = doc.data()
  return { auth: 'pending', ...encrypted_vote } as PendingVoteSummary
}

const makePageId = (num: number) => String(num).padStart(6, '0')

const getOrInitRoot = async (rootRef: firestore.DocumentReference): Promise<RootMeta> => {
  const snap = await rootRef.get()
  if (snap.exists) return snap.data() as RootMeta

  const init: RootMeta = {
    etagSeed: randomBytes(4).toString('hex'),
    lastPackedCreatedAt: null,
    lastPackedDocId: null,
    nextPageNum: 2,
    observedPending: 0,
    observedVotes: 0,
    packedPending: 0,
    packedVotes: 0,
    updatedAt: firestore.Timestamp.fromMillis(0),
  }

  await rootRef.set(init, { merge: true })
  return init
}

const tryAcquireLease = async (db: firestore.Firestore, leaseRef: firestore.DocumentReference, ttlMs: number) => {
  const owner = randomUUID()
  const nowMs = Date.now()

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(leaseRef)
    const data = (snap?.data() as { expiresAt?: firestore.Timestamp }) || {}
    const { expiresAt } = data

    const expired = !expiresAt || expiresAt.toMillis() <= nowMs
    if (!expired) return { ok: false as const }

    const newExpiresAt = firestore.Timestamp.fromMillis(nowMs + ttlMs)
    tx.set(leaseRef, { expiresAt: newExpiresAt, owner }, { merge: true })
    return { ok: true as const, owner }
  })
}

const releaseLease = async (db: firestore.Firestore, leaseRef: firestore.DocumentReference, owner: string) => {
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(leaseRef)
    if (!snap.exists) return
    const data = snap.data() as { owner?: string }
    if (data?.owner !== owner) return
    tx.set(leaseRef, { expiresAt: firestore.Timestamp.fromMillis(0) }, { merge: true })
  })
}

const readAllCachedPages = async (pagesCol: firestore.CollectionReference) => {
  // 00001 style ids => lexicographic order
  const snap = await pagesCol.orderBy(firestore.FieldPath.documentId()).get()
  const votes: VoteSummary[] = []
  const pendingVotes: VoteSummary[] = []

  for (const d of snap.docs) {
    const data = (d.data() as { pendingVotes?: VoteSummary[]; votes?: VoteSummary[] }) || {}
    if (Array.isArray(data.votes)) votes.push(...data.votes)
    if (Array.isArray(data.pendingVotes)) pendingVotes.push(...data.pendingVotes)
  }

  return { pageCount: snap.docs.length, pendingVotes, votes }
}

const maybePackNewVotes = async (args: {
  electionDoc: firestore.DocumentReference
  leaseRef: firestore.DocumentReference
  observedPending: number
  observedVotes: number
  pagesCol: firestore.CollectionReference
  rootRef: firestore.DocumentReference
}) => {
  const { electionDoc, leaseRef, observedPending, observedVotes, pagesCol, rootRef } = args
  const db = electionDoc.firestore

  const root = await getOrInitRoot(rootRef)
  const updatedAtMs = root.updatedAt?.toMillis() ?? 0
  if (Date.now() - updatedAtMs < PACK_THROTTLE_MS) return

  const lease = await tryAcquireLease(db, leaseRef, LEASE_TTL_MS)
  if (!lease.ok) return

  try {
    // re-read root after lease to avoid duplicate work
    const freshRoot = await getOrInitRoot(rootRef)

    let nextPageNum = freshRoot.nextPageNum
    let openPageId = makePageId(nextPageNum - 1)

    const openPageRef = pagesCol.doc(openPageId)
    const openPageSnap = await openPageRef.get()

    const data = openPageSnap.exists
      ? (openPageSnap.data() as { bytesApprox?: number; pendingVotes?: VoteSummary[]; votes?: VoteSummary[] })
      : undefined
    let pageVotes: VoteSummary[] = data?.votes ?? []
    let pagePending: VoteSummary[] = data?.pendingVotes ?? []
    let bytesApprox = data?.bytesApprox ?? approxBytes({ pendingVotes: pagePending, votes: pageVotes })

    // tail queries since cursor
    let votesQuery = electionDoc.collection('votes').orderBy('created_at').orderBy(firestore.FieldPath.documentId())

    let pendingQuery = electionDoc
      .collection('votes-pending')
      .orderBy('created_at')
      .orderBy(firestore.FieldPath.documentId())

    if (freshRoot.lastPackedCreatedAt && freshRoot.lastPackedDocId) {
      votesQuery = votesQuery.startAfter(freshRoot.lastPackedCreatedAt, freshRoot.lastPackedDocId)
      pendingQuery = pendingQuery.startAfter(freshRoot.lastPackedCreatedAt, freshRoot.lastPackedDocId)
    }

    const [newVotesSnap, newPendingSnap] = await Promise.all([votesQuery.get(), pendingQuery.get()])

    if (newVotesSnap.empty && newPendingSnap.empty) return

    const newVotes = newVotesSnap.docs.map(mapVoteDoc)
    const newPending = newPendingSnap.docs.map(mapPendingVoteDoc)

    const appendIntoCurrentPage = <T extends Summary>(items: T[], target: T[]) => {
      let i = 0
      for (; i < items.length; i += 1) {
        const item = items[i]
        const delta = approxBytes(item) + 8
        if (bytesApprox + delta > MAX_PAGE_BYTES) break
        target.push(item)
        bytesApprox += delta
      }
      return items.slice(i)
    }

    let remainingVotes = appendIntoCurrentPage(newVotes, pageVotes)
    let remainingPending = appendIntoCurrentPage(newPending, pagePending)

    await openPageRef.set(
      {
        bytesApprox,
        pendingVotes: pagePending,
        sealed: bytesApprox > MAX_PAGE_BYTES * 0.98,
        votes: pageVotes,
      },
      { merge: true },
    )

    const rollToNewPage = async () => {
      await openPageRef.set({ sealed: true }, { merge: true })

      openPageId = makePageId(nextPageNum)
      nextPageNum += 1
      pageVotes = []
      pagePending = []
      bytesApprox = approxBytes({ pendingVotes: [], votes: [] })

      await pagesCol.doc(openPageId).set({ bytesApprox, pendingVotes: [], sealed: false, votes: [] }, { merge: true })
    }

    while (remainingVotes.length || remainingPending.length) {
      await rollToNewPage()
      remainingVotes = appendIntoCurrentPage(remainingVotes, pageVotes)
      remainingPending = appendIntoCurrentPage(remainingPending, pagePending)

      await pagesCol.doc(openPageId).set({ bytesApprox, pendingVotes: pagePending, votes: pageVotes }, { merge: true })
    }

    const lastVote = newVotesSnap.docs.at(-1)
    const lastPending = newPendingSnap.docs.at(-1)

    let lastDoc = lastVote || lastPending

    if (lastVote && lastPending) {
      const vote_time = lastVote.get('created_at')?.toMillis() || 0
      const pending_time = lastPending.get('created_at')?.toMillis() || 0

      if (pending_time > vote_time) lastDoc = lastPending
      else if (pending_time === vote_time && lastPending.id > lastVote.id) lastDoc = lastPending // tie-break same as query ordering
    }

    const lastPackedCreatedAt = (lastDoc?.get('created_at') as firestore.Timestamp | undefined) ?? null
    const lastPackedDocId = lastDoc?.id ?? null

    await rootRef.set(
      {
        lastPackedCreatedAt: lastPackedCreatedAt ?? freshRoot.lastPackedCreatedAt ?? null,
        lastPackedDocId: lastPackedDocId ?? freshRoot.lastPackedDocId ?? null,
        nextPageNum,
        observedPending,
        observedVotes,
        packedPending: (freshRoot.packedPending ?? 0) + newPending.length,
        packedVotes: (freshRoot.packedVotes ?? 0) + newVotes.length,
        updatedAt: firestore.Timestamp.now(),
      },
      { merge: true },
    )
  } finally {
    await releaseLease(db, leaseRef, lease.owner)
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const startTime = Date.now()
  let totalReads = 0

  const { election_id } = req.query
  if (typeof election_id !== 'string') return res.status(400).json({ error: 'Missing required election_id' })

  const db = firebase.firestore()
  const electionDoc = db.collection('elections').doc(election_id)

  const electionSnap = await electionDoc.get()
  totalReads += 1
  if (!electionSnap.exists) return res.status(400).json({ error: 'Unknown Election ID.' })

  const electionData = (electionSnap.data() as { num_pending_votes?: number; num_votes?: number }) || {}
  const observedPending = electionData.num_pending_votes ?? 0
  const observedVotes = (electionData.num_votes ?? 0) - observedPending
  if (observedVotes < 0)
    await pushover('/cache-accepted: observedVotes < 0', `[${election_id}] observedVotes: ${observedVotes}`)

  const cachedRootRef = electionDoc.collection('votes-cached').doc('root')
  const cachedPagesCol = cachedRootRef.collection('pages')
  const leaseRef = electionDoc.collection('votes-cached').doc('lease')

  // 1) Root meta read
  let root = await getOrInitRoot(cachedRootRef)
  totalReads += 1

  // 2) Best-effort pack only if counters moved AND throttle window passed
  const needsPack = observedVotes > (root.observedVotes ?? 0) || observedPending > (root.observedPending ?? 0)
  const updatedAtMs = root.updatedAt?.toMillis() ?? 0
  const throttlePassed = Date.now() - updatedAtMs >= PACK_THROTTLE_MS

  if (needsPack && throttlePassed) {
    await maybePackNewVotes({
      electionDoc,
      leaseRef,
      observedPending,
      observedVotes,
      pagesCol: cachedPagesCol,
      rootRef: cachedRootRef,
    })

    const postPackSnap = await cachedRootRef.get()
    totalReads += 1
    root = (postPackSnap.data() as RootMeta) ?? root
  }

  // 3) ETag + caching headers based on final root
  const etag = makeEtag(root)
  setCachingHeaders(res, etag)

  if (req.headers['if-none-match'] === etag) return res.status(304).end()

  // 4) Read cached pages
  const cached = await readAllCachedPages(cachedPagesCol)
  totalReads += 1 + cached.pageCount

  // 5) Read tail since latest cursor (usually small)
  let votesQuery = electionDoc.collection('votes').orderBy('created_at').orderBy(firestore.FieldPath.documentId())

  let pendingQuery = electionDoc
    .collection('votes-pending')
    .orderBy('created_at')
    .orderBy(firestore.FieldPath.documentId())

  if (root.lastPackedCreatedAt && root.lastPackedDocId) {
    votesQuery = votesQuery.startAfter(root.lastPackedCreatedAt, root.lastPackedDocId)
    pendingQuery = pendingQuery.startAfter(root.lastPackedCreatedAt, root.lastPackedDocId)
  }

  const [freshVotesSnap, freshPendingSnap] = await Promise.all([votesQuery.get(), pendingQuery.get()])
  totalReads += 1 + freshVotesSnap.docs.length
  totalReads += 1 + freshPendingSnap.docs.length

  const freshVotes = freshVotesSnap.docs.map(mapVoteDoc)
  const freshPendingVotes = freshPendingSnap.docs.map(mapPendingVoteDoc)

  const votes = [...cached.votes, ...freshVotes]
  const pendingVotes = [...cached.pendingVotes, ...freshPendingVotes]

  // Warn if we're missing votes
  await (async function () {
    const expectedTotal = observedVotes + observedPending
    const served = votes.length + pendingVotes.length
    if (served < expectedTotal)
      await pushover(
        'cache-accepted mismatch:',
        `election: ${election_id}\nexpected: ${expectedTotal}\nserved: ${served}`,
      )
  })()

  return res.status(200).json({
    _stats: {
      __endpoint: {
        __name: '/cache-accepted',
        _etag: etag,
        duration: `${Date.now() - startTime}ms`,
        now: new Date().toLocaleString(),
      },
      //   cached_pages: cached.pageCount,
      pending: { cached: cached.pendingVotes.length, fresh: freshPendingVotes.length },
      votes: { cached: cached.votes.length, fresh: freshVotes.length },
      z_total_reads: totalReads,
    },
    results: [...votes, ...pendingVotes],
  })
}
