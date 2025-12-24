import type { NextApiRequest, NextApiResponse } from 'next'

import { createHash, randomUUID } from 'crypto'
import { firestore } from 'firebase-admin'
import { CipherStrings } from 'src/crypto/stringify-shuffle'

import { firebase, pushover } from '../../_services'

type EncryptedVote = Record<string, CipherStrings>
type PendingVoteSummary = EncryptedVote & { auth: 'pending' }
type RootMeta = {
  currentPageNum: number
  lastPackedCreatedAt: firestore.Timestamp | null
  lastPackedDocId: null | string
  observedPending: number
  observedVotes: number
  packedPending: number
  packedVotes: number
  updatedAt: firestore.Timestamp
}
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

// Assumes we're running in (Vercel) isolated serverless nodes, so global state doesn't risk contention
let reads = 0
let writes = 0
let deletes = 0

const makeEtag = ({
  observedPending,
  observedVotes,
  root,
}: {
  observedPending: number
  observedVotes: number
  root: RootMeta
}) => {
  const seed = [
    root.lastPackedCreatedAt?.toMillis() ?? 0,
    root.lastPackedDocId ?? '',
    observedVotes,
    observedPending,
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

const getOrInitRoot = async (rootRef: firestore.DocumentReference) => {
  const snap = await rootRef.get()
  reads += 1
  if (snap.exists) return snap.data() as RootMeta

  const init: RootMeta = {
    currentPageNum: 1,
    lastPackedCreatedAt: null,
    lastPackedDocId: null,
    observedPending: 0,
    observedVotes: 0,
    packedPending: 0,
    packedVotes: 0,
    updatedAt: firestore.Timestamp.fromMillis(Date.now() - PACK_THROTTLE_MS),
  }

  await rootRef.set(init)
  writes += 1
  return init
}

const tryAcquireLease = async (db: firestore.Firestore, leaseRef: firestore.DocumentReference, ttlMs: number) => {
  const owner = randomUUID()
  const nowMs = Date.now()

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(leaseRef)
    reads += 1 // Note: Firestore transactions may auto-retry, without charging for retries, so reads/writes may slightly overcount in rare contention cases
    const data = (snap?.data() as { expiresAt?: firestore.Timestamp }) || {}
    const { expiresAt } = data

    const expired = !expiresAt || expiresAt.toMillis() <= nowMs
    if (!expired) return { ok: false as const }

    const newExpiresAt = firestore.Timestamp.fromMillis(nowMs + ttlMs)
    tx.set(leaseRef, { expiresAt: newExpiresAt, owner }, { merge: true })
    writes += 1
    return { ok: true as const, owner }
  })
}

const releaseLease = async (db: firestore.Firestore, leaseRef: firestore.DocumentReference, owner: string) => {
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(leaseRef)
    reads += 1
    if (!snap.exists) return
    const data = snap.data() as { owner?: string }
    if (data?.owner !== owner) return
    tx.delete(leaseRef)
    deletes += 1
  })
}

const readAllCachedPages = async (pagesCol: firestore.CollectionReference) => {
  // 000001 style ids => lexicographic order
  const snap = await pagesCol.orderBy(firestore.FieldPath.documentId()).get()
  reads += Math.max(1, snap.docs.length)
  const votes: VoteSummary[] = []
  const pendingVotes: VoteSummary[] = []

  for (const d of snap.docs) {
    const data = (d.data() as { pendingVotes?: VoteSummary[]; votes?: VoteSummary[] }) || {}
    if (Array.isArray(data.votes)) votes.push(...data.votes)
    if (Array.isArray(data.pendingVotes)) pendingVotes.push(...data.pendingVotes)
  }

  return { pageCount: snap.docs.length, pendingVotes, votes }
}

/** Returns didPack so the handler can avoid returning duplicates. */
const maybePackNewVotes = async (args: {
  electionDoc: firestore.DocumentReference
  leaseRef: firestore.DocumentReference
  observedPending: number
  observedVotes: number
  pagesCol: firestore.CollectionReference
  rootRef: firestore.DocumentReference
  tailPendingDocs: firestore.QueryDocumentSnapshot[]
  tailVotesDocs: firestore.QueryDocumentSnapshot[]
}): Promise<boolean> => {
  const { electionDoc, leaseRef, observedPending, observedVotes, pagesCol, rootRef, tailPendingDocs, tailVotesDocs } =
    args
  const db = electionDoc.firestore

  if (tailVotesDocs.length === 0 && tailPendingDocs.length === 0) return false

  const lease = await tryAcquireLease(db, leaseRef, LEASE_TTL_MS)
  if (!lease.ok || !lease.owner) return false

  try {
    // Get fresh root after lease so we use the latest page/cursor state before writing.
    const freshRoot = await getOrInitRoot(rootRef)

    let { currentPageNum } = freshRoot
    let openPageId = makePageId(currentPageNum)

    const openPageRef = pagesCol.doc(openPageId)
    const openPageSnap = await openPageRef.get()
    reads += 1

    const data = openPageSnap.exists
      ? (openPageSnap.data() as { bytesApprox?: number; pendingVotes?: PendingVoteSummary[]; votes?: VoteSummary[] })
      : undefined
    let pageVotes: VoteSummary[] = data?.votes ?? []
    let pagePending: PendingVoteSummary[] = data?.pendingVotes ?? []
    let bytesApprox = data?.bytesApprox ?? approxBytes({ pendingVotes: pagePending, votes: pageVotes })

    const newVotes = tailVotesDocs.map(mapVoteDoc)
    const newPending = tailPendingDocs.map(mapPendingVoteDoc)

    const appendIntoCurrentPage = <T extends PendingVoteSummary | VoteSummary>(items: T[], target: T[]) => {
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

    await openPageRef.set({
      bytesApprox,
      pendingVotes: pagePending,
      votes: pageVotes,
    })
    writes += 1

    const rollToNewPage = async () => {
      currentPageNum += 1
      openPageId = makePageId(currentPageNum)
      pageVotes = []
      pagePending = []
      bytesApprox = approxBytes({ pendingVotes: [], votes: [] })

      await pagesCol.doc(openPageId).set({ bytesApprox, pendingVotes: [], votes: [] })
      writes += 1
    }

    while (remainingVotes.length || remainingPending.length) {
      await rollToNewPage()
      remainingVotes = appendIntoCurrentPage(remainingVotes, pageVotes)
      remainingPending = appendIntoCurrentPage(remainingPending, pagePending)

      await pagesCol.doc(openPageId).set({ bytesApprox, pendingVotes: pagePending, votes: pageVotes })
      writes += 1
    }

    // Cursor: max(lastVote,lastPending) under (created_at, docId) ordering
    const lastVote = tailVotesDocs.at(-1)
    const lastPending = tailPendingDocs.at(-1)

    let lastDoc = lastVote || lastPending

    if (lastVote && lastPending) {
      const voteTime = lastVote.get('created_at')?.toMillis() || 0
      const pendingTime = lastPending.get('created_at')?.toMillis() || 0

      if (pendingTime > voteTime) lastDoc = lastPending
      else if (pendingTime === voteTime && lastPending.id > lastVote.id) lastDoc = lastPending
    }

    const lastPackedCreatedAt = (lastDoc?.get('created_at') as firestore.Timestamp | undefined) ?? null
    const lastPackedDocId = lastDoc?.id ?? null

    await rootRef.set(
      {
        currentPageNum,
        lastPackedCreatedAt: lastPackedCreatedAt ?? freshRoot.lastPackedCreatedAt ?? null,
        lastPackedDocId: lastPackedDocId ?? freshRoot.lastPackedDocId ?? null,
        observedPending,
        observedVotes,
        packedPending: (freshRoot.packedPending ?? 0) + newPending.length,
        packedVotes: (freshRoot.packedVotes ?? 0) + newVotes.length,
        updatedAt: firestore.Timestamp.now(),
      },
      { merge: true },
    )
    writes += 1

    return true
  } finally {
    await releaseLease(db, leaseRef, lease.owner)
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const startTime = Date.now()
  reads = 0
  writes = 0
  deletes = 0

  const { election_id } = req.query
  if (typeof election_id !== 'string') return res.status(400).json({ error: 'Missing required election_id' })

  const db = firebase.firestore()
  const electionDoc = db.collection('elections').doc(election_id)

  const electionSnap = await electionDoc.get()
  reads += 1
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

  // 2) Decide whether to attempt pack
  const hasFreshVotes = observedVotes > (root.observedVotes ?? 0) || observedPending > (root.observedPending ?? 0)
  const throttlePassed = Date.now() - root.updatedAt.toMillis() >= PACK_THROTTLE_MS

  // Prepare tail query ONCE if we might need it (either to pack or to serve)
  let tailVotesDocs: firestore.QueryDocumentSnapshot[] = []
  let tailPendingDocs: firestore.QueryDocumentSnapshot[] = []

  const runTailQuery = async () => {
    let votesQuery = electionDoc.collection('votes').orderBy('created_at').orderBy(firestore.FieldPath.documentId())
    let pendingQuery = electionDoc
      .collection('votes-pending')
      .orderBy('created_at')
      .orderBy(firestore.FieldPath.documentId())

    if (root.lastPackedCreatedAt && root.lastPackedDocId) {
      votesQuery = votesQuery.startAfter(root.lastPackedCreatedAt, root.lastPackedDocId)
      pendingQuery = pendingQuery.startAfter(root.lastPackedCreatedAt, root.lastPackedDocId)
    }

    const [votesSnap, pendingSnap] = await Promise.all([votesQuery.get(), pendingQuery.get()])
    reads += Math.max(1, votesSnap.docs.length)
    reads += Math.max(1, pendingSnap.docs.length)

    tailVotesDocs = votesSnap.docs
    tailPendingDocs = pendingSnap.docs
  }
  let didPack = false

  // If we have new stuff, grab it
  if (hasFreshVotes) {
    await runTailQuery()

    // Attempt pack if allowed, using tail we already fetched.
    if (throttlePassed) {
      didPack = await maybePackNewVotes({
        electionDoc,
        leaseRef,
        observedPending,
        observedVotes,
        pagesCol: cachedPagesCol,
        rootRef: cachedRootRef,
        tailPendingDocs,
        tailVotesDocs,
      })

      if (didPack) {
        // Root changed; re-read once so ETag + cursor match what we'll serve.
        const postPackSnap = await cachedRootRef.get()
        reads += 1
        root = (postPackSnap.data() as RootMeta) ?? root
        // Packed tail is now in cache; don't return it as "fresh"
        tailVotesDocs = []
        tailPendingDocs = []
      }
    }
  }

  // 3) ETag based on (root + observed counters) so it matches the representation we serve
  const etag = makeEtag({ observedPending, observedVotes, root })
  setCachingHeaders(res, etag)

  // Stop early if ETag matches
  if (req.headers['if-none-match'] === etag) return res.status(304).end()

  // 4) Read cached pages
  const cached = await readAllCachedPages(cachedPagesCol)

  // 5) Merge cached & fresh votes together
  const freshVotes = tailVotesDocs.map(mapVoteDoc)
  const freshPendingVotes = tailPendingDocs.map(mapPendingVoteDoc)

  const votes = [...cached.votes, ...freshVotes]
  const pendingVotes = [...cached.pendingVotes, ...freshPendingVotes]

  // Warn if votes missing
  const expectedTotal = observedVotes + observedPending
  const served = votes.length + pendingVotes.length
  if (served < expectedTotal)
    await pushover('cache-accepted mismatch:', `[${election_id}] expected: ${expectedTotal} served: ${served}`)

  return res.status(200).json({
    _stats: {
      _endpoint: {
        __name: '/cache-accepted',
        _etag: etag,
        duration: `${Date.now() - startTime}ms`,
        now: new Date().toLocaleString(),
      },
      cacheHits: {
        last_updated_at: root.updatedAt?.toDate().toLocaleString(),
        pages: cached.pageCount,
        pending: { cached: cached.pendingVotes.length, fresh: freshPendingVotes.length },
        votes: { cached: cached.votes.length, fresh: freshVotes.length },
      },
      didPack,
      ops: { deletes, reads, writes },
    },
    results: [...votes, ...pendingVotes],
  })
}
