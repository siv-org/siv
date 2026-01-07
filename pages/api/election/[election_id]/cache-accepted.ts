import type { NextApiRequest, NextApiResponse } from 'next'

import { createHash, randomUUID } from 'crypto'
import { firestore } from 'firebase-admin'
import { CipherStrings } from 'src/crypto/stringify-shuffle'

import { firebase, pushover } from '../../_services'

type EncryptedVote = Record<string, CipherStrings>
type PendingVoteSummary = EncryptedVote & { auth: 'pending'; link_auth?: string }
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

// Per-invocation counters, reset at start of handler. Fine for isolated serverless
let [reads, writes, deletes] = [0, 0, 0]
function logOp(key: 'delete' | 'read' | 'write', amount: number, ...label: string[]) {
  const minAmount = Math.max(1, amount)
  let newAmount: number = 0
  let color = ''
  const BLUE = '\x1b[34m'
  const ORANGE = '\x1b[33m'
  const PINK = '\x1b[35m'
  switch (key) {
    case 'delete':
      deletes += minAmount
      newAmount = deletes
      color = PINK
      break
    case 'read':
      reads += minAmount
      newAmount = reads
      color = BLUE
      break
    case 'write':
      writes += minAmount
      newAmount = writes
      color = ORANGE
      break
    default:
      throw new Error(`Invalid key: ${key}`)
  }

  const GRAY = '\x1b[90m'
  const RESET = '\x1b[0m'
  if (amount === 0) label.push(`${GRAY}[min 1]${RESET}`)

  if (process.env.NODE_ENV !== 'production')
    console.log(color, (key + 's').padStart(7, ' '), String(newAmount).padStart(2) + RESET, '|', ...label)
}
const logRead = (amount: number, ...label: string[]) => logOp('read', amount, ...label)
const logWrite = (amount: number, ...label: string[]) => logOp('write', amount, ...label)
const logDelete = (amount: number, ...label: string[]) => logOp('delete', amount, ...label)
function resetOpCounters() {
  ;[reads, writes, deletes] = [0, 0, 0]
  if (process.env.NODE_ENV !== 'production') console.log('\n/cache-accepted')
}

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
  const { encrypted_vote, link_auth } = doc.data()
  return { auth: 'pending', ...encrypted_vote, link_auth } as PendingVoteSummary
}

const makePageId = (num: number) => String(num).padStart(6, '0')

const getOrInitRoot = async (rootRef: firestore.DocumentReference) => {
  const snap = await rootRef.get()
  logRead(+snap.exists, 'getOrInitRoot')
  if (snap.exists) return snap.data() as RootMeta

  const init: RootMeta = {
    currentPageNum: 1,
    lastPackedCreatedAt: null,
    lastPackedDocId: null,
    observedPending: 0,
    observedVotes: 0,
    packedPending: 0,
    packedVotes: 0,
    updatedAt: firestore.Timestamp.fromMillis(Date.now() - PACK_THROTTLE_MS), // so first request can pack immediately
  }

  await rootRef.set(init)
  logWrite(1, 'getOrInitRoot')
  return init
}

/** Lease is best-effort concurrency control: prevents two packers from writing pages concurrently.
    TTL handles crashed workers; release deletes lease doc early. */
const tryAcquireLease = async (db: firestore.Firestore, leaseRef: firestore.DocumentReference, ttlMs: number) => {
  const owner = randomUUID()
  const nowMs = Date.now()

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(leaseRef)
    // Note: Firestore transactions may auto-retry, without charging for retries, so reads/writes may slightly overcount in rare contention cases
    logRead(1, 'tryAcquireLease')
    const data = (snap?.data() as { expiresAt?: firestore.Timestamp }) || {}
    const { expiresAt } = data

    const expired = !expiresAt || expiresAt.toMillis() <= nowMs
    if (!expired) return { ok: false as const }

    const newExpiresAt = firestore.Timestamp.fromMillis(nowMs + ttlMs)
    tx.set(leaseRef, { expiresAt: newExpiresAt, owner })
    logWrite(1, 'tryAcquireLease')
    return { ok: true as const, owner }
  })
}

const releaseLease = async (db: firestore.Firestore, leaseRef: firestore.DocumentReference, owner: string) => {
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(leaseRef)
    logRead(1, 'releaseLease')
    if (!snap.exists) return pushover('cache-accepted releaseLease missing', `lease not found: ${leaseRef.path}`)
    const data = snap.data() as { owner?: string }
    if (data?.owner !== owner) return pushover('cache-accepted releaseLease', `lease not owned: ${leaseRef.path}`)
    tx.delete(leaseRef)
    logDelete(1, 'releaseLease')
  })
}

const readAllCachedPages = async (pagesCol: firestore.CollectionReference) => {
  // 000001 style ids => lexicographic order
  const snap = await pagesCol.orderBy(firestore.FieldPath.documentId()).get()
  logRead(snap.size, 'readAllCachedPages')
  const votes: VoteSummary[] = []
  const pendingVotes: VoteSummary[] = []

  for (const d of snap.docs) {
    const data = (d.data() as { pendingVotes?: VoteSummary[]; votes?: VoteSummary[] }) || {}
    if (Array.isArray(data.votes)) votes.push(...data.votes)
    if (Array.isArray(data.pendingVotes)) pendingVotes.push(...data.pendingVotes)
  }

  return { pageCount: snap.size, pendingVotes, votes }
}

const maybePackNewVotes = async (args: {
  electionDoc: firestore.DocumentReference
  leaseRef: firestore.DocumentReference
  observedPending: number
  observedVotes: number
  pagesCol: firestore.CollectionReference
  rootRef: firestore.DocumentReference
  tailPendingDocs: firestore.QueryDocumentSnapshot[]
  tailVotesDocs: firestore.QueryDocumentSnapshot[]
}): Promise<{ didPack: false } | { didPack: true; newRoot: RootMeta }> => {
  const { electionDoc, leaseRef, observedPending, observedVotes, pagesCol, rootRef, tailPendingDocs, tailVotesDocs } =
    args
  const db = electionDoc.firestore

  if (tailVotesDocs.length === 0 && tailPendingDocs.length === 0) return { didPack: false }

  const lease = await tryAcquireLease(db, leaseRef, LEASE_TTL_MS)
  if (!lease.ok || !lease.owner) return { didPack: false }

  try {
    // Get fresh root after lease so we use the latest page/cursor state before writing.
    const freshRoot = await getOrInitRoot(rootRef)

    let { currentPageNum } = freshRoot
    let openPageId = makePageId(currentPageNum)

    const openPageRef = pagesCol.doc(openPageId)
    const openPageSnap = await openPageRef.get()
    logRead(1, 'maybePackNewVotes openPageRef')

    const data = openPageSnap.exists
      ? (openPageSnap.data() as { bytesApprox?: number; pendingVotes?: PendingVoteSummary[]; votes?: VoteSummary[] })
      : undefined
    let pageVotes: VoteSummary[] = data?.votes ?? []
    let pagePending: PendingVoteSummary[] = data?.pendingVotes ?? []
    let bytesApprox = data?.bytesApprox ?? approxBytes({ pendingVotes: pagePending, votes: pageVotes })

    const newVotes = tailVotesDocs.map(mapVoteDoc)
    const newPending = tailPendingDocs.map(mapPendingVoteDoc)

    /** `bytesApprox` is a heuristic to keep pages under Firestore doc limits.
        We accept some slop; correctness doesn't depend on exact byte counts. */
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
    logWrite(1, 'maybePackNewVotes openPageRef')

    while (remainingVotes.length || remainingPending.length) {
      currentPageNum += 1
      openPageId = makePageId(currentPageNum)
      pageVotes = []
      pagePending = []
      bytesApprox = approxBytes({ pendingVotes: [], votes: [] })

      remainingVotes = appendIntoCurrentPage(remainingVotes, pageVotes)
      remainingPending = appendIntoCurrentPage(remainingPending, pagePending)

      await pagesCol.doc(openPageId).set({ bytesApprox, pendingVotes: pagePending, votes: pageVotes })
      logWrite(1, 'maybePackNewVotes while loop')
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

    const newRoot: RootMeta = {
      currentPageNum,
      lastPackedCreatedAt: lastPackedCreatedAt ?? freshRoot.lastPackedCreatedAt,
      lastPackedDocId: lastPackedDocId ?? freshRoot.lastPackedDocId ?? null,
      observedPending,
      observedVotes,
      packedPending: (freshRoot.packedPending ?? 0) + newPending.length,
      packedVotes: (freshRoot.packedVotes ?? 0) + newVotes.length,
      updatedAt: firestore.Timestamp.now(),
    }

    await rootRef.set(newRoot, { merge: true })
    logWrite(1, 'maybePackNewVotes root')

    return { didPack: true, newRoot }
  } finally {
    await releaseLease(db, leaseRef, lease.owner)
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const startTime = Date.now()
  resetOpCounters()

  const { election_id } = req.query
  if (typeof election_id !== 'string') return res.status(400).json({ error: 'Missing required election_id' })

  const db = firebase.firestore()
  const electionDoc = db.collection('elections').doc(election_id)

  const electionSnap = await electionDoc.get()
  logRead(1, 'main electionDoc')
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

  /** Tail query is the single source of truth for "what isn't cached yet".
      Must use the same ordering + tie-break as cursor updates. */
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
    logRead(votesSnap.size, 'runTailQuery (votes)')
    logRead(pendingSnap.size, 'runTailQuery (pending)')

    tailVotesDocs = votesSnap.docs
    tailPendingDocs = pendingSnap.docs
  }
  let didPack = false

  // If we have new stuff, grab it
  if (hasFreshVotes) {
    await runTailQuery()

    // Attempt pack if allowed, using tail we already fetched
    if (throttlePassed) {
      const packResult = await maybePackNewVotes({
        electionDoc,
        leaseRef,
        observedPending,
        observedVotes,
        pagesCol: cachedPagesCol,
        rootRef: cachedRootRef,
        tailPendingDocs,
        tailVotesDocs,
      })
      if (packResult.didPack) {
        // Root changed; use computed newRoot so ETag + cursor match what we'll serve
        root = packResult.newRoot
        // Packed tail is now in cache; don't return it as "fresh"
        tailVotesDocs = []
        tailPendingDocs = []
        didPack = true
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

  // 6) Deduplicate: remove pending votes that have been accepted
  //    (pending votes use link_auth, accepted votes use auth=link_auth)
  let deduplicatedPending = pendingVotes
  const runDedupe = votes.length && pendingVotes.length
  if (runDedupe) {
    // We only need to deduplicate if we have both accepted and pending votes
    const acceptedAuths = new Set(votes.map((v) => v.auth))
    deduplicatedPending = pendingVotes.filter((pv) => {
      const linkAuth = typeof pv.link_auth === 'string' ? pv.link_auth : undefined
      return !linkAuth || !acceptedAuths.has(linkAuth)
    })
  }

  // 7) Strip out pendings' link_auth before serving
  const cleanedPending = deduplicatedPending.map((pv) => {
    delete pv.link_auth
    return pv
  })

  // Warn if votes missing
  const expectedTotal = observedVotes + observedPending
  const served = votes.length + cleanedPending.length
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
        last_updated_at: root.updatedAt.toDate().toLocaleString(),
        pages: cached.pageCount,
        pending: {
          cached: cached.pendingVotes.length,
          fresh: freshPendingVotes.length,
          ...(runDedupe && { removed_by_dedupe: pendingVotes.length - deduplicatedPending.length }),
        },
        votes: { cached: cached.votes.length, fresh: freshVotes.length },
      },
      didPack,
      ops: { deletes, reads, writes },
    },
    results: [...votes, ...cleanedPending],
  })
}

/** /api/election/[election_id]/cache-accepted

Goal:
- Serve all votes (accepted + pending) with low Firestore read costs.
- Maintain a cached, paged copy under elections/{id}/votes-cached/root/pages/{000001..}
- Only do heavy packing work occasionally (throttled) and under a lease.

Data model:
- root doc: cursor + bookkeeping
  - lastPackedCreatedAt + lastPackedDocId define the "cursor" (ordered by created_at, then docId).
  - currentPageNum is the *open* page number we append into.
- pages/{000001..}: arrays { votes, pendingVotes } + bytesApprox (approx size guard)

Serving strategy:
- Always serve: (all cached pages) + (tail query since cursor)
- If we successfully pack, we write tail into cache and then serve cached-only (tail cleared).
- Deduplication: pending votes with link_auth matching an accepted vote's auth are filtered out.
  This prevents votes from appearing twice (once as pending, once as accepted) when they transition.

Packing strategy (best-effort):
- Only attempt pack when counters suggest new docs exist (observedVotes/observedPending moved)
- Pack is throttled via root.updatedAt (PACK_THROTTLE_MS).
- Lease is a single doc with TTL; acquisition is transactional.

ETag:
- ETag is derived from (cursor + observed counters) so it matches the representation we serve.
- Important: ETag must change if response body would change, even if root didn’t pack yet.

Important invariants:
- Cursor ordering is (created_at ASC, docId ASC) for both votes collections.
- Cursor always advances to max(lastVote,lastPending) under that ordering.
- Pages are append-only in practice (we rewrite whole arrays, but logically append-only).
- Page ids are zero-padded so lexicographic order == numeric order.

Ops counters:
- reads/writes/deletes are debugging-only.
- Transactions can retry; counts may slightly overcount under contention. */
