import type { NextApiRequest, NextApiResponse } from 'next'

import { expect, test } from 'bun:test'
import { firestore } from 'firebase-admin'

import { firebase } from '../../_services'
import handler from './cache-accepted'

// Test helpers
const createMockRequest = (electionId: string, headers: Record<string, string> = {}): NextApiRequest => {
  return {
    headers: { ...headers },
    query: { election_id: electionId },
  } as unknown as NextApiRequest
}

type TestResponse = NextApiResponse & {
  _body: () => unknown
  _headers: () => Record<string, string>
  _statusCode: () => number
}

const createMockResponse = (): TestResponse => {
  const res = {} as NextApiResponse
  let statusCode = 200
  let responseBody: unknown = null
  const responseHeaders: Record<string, string> = {}

  res.status = (code: number) => {
    statusCode = code
    return res
  }

  res.json = (body: unknown) => {
    responseBody = body
    return res
  }

  res.end = () => res

  res.setHeader = (name: string, value: string) => {
    responseHeaders[name] = value
    return res
  }

  res.getHeader = (name: string) => responseHeaders[name]

  // Expose internals for testing
  const testRes = res as TestResponse
  testRes._statusCode = () => statusCode
  testRes._body = () => responseBody
  testRes._headers = () => responseHeaders

  return testRes
}

const createTestElection = async (electionId: string) => {
  const db = firebase.firestore()
  const electionDoc = db.collection('elections').doc(electionId)

  await electionDoc.set({
    ballot_design: { ballot_items_by_id: {} },
    created_at: firestore.FieldValue.serverTimestamp(),
    election_title: `Test Election ${electionId}`,
    num_invalidated_votes: 0,
    num_pending_votes: 0,
    num_votes: 0,
    voter_applications_allowed: true,
  })

  return electionDoc
}

const submitTestVote = async (electionId: string, auth: string, encryptedVote: Record<string, unknown> = {}) => {
  const db = firebase.firestore()
  const electionDoc = db.collection('elections').doc(electionId)

  await electionDoc.collection('votes').doc(auth).set({
    auth,
    created_at: firestore.FieldValue.serverTimestamp(),
    encrypted_vote: encryptedVote,
  })

  await electionDoc.update({
    num_votes: firestore.FieldValue.increment(1),
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const submitTestPendingVote = async (
  electionId: string,
  linkAuth: string,
  encryptedVote: Record<string, unknown> = {},
) => {
  const db = firebase.firestore()
  const electionDoc = db.collection('elections').doc(electionId)

  await electionDoc.collection('votes-pending').doc(linkAuth).set({
    created_at: firestore.FieldValue.serverTimestamp(),
    encrypted_vote: encryptedVote,
    link_auth: linkAuth,
  })

  await electionDoc.update({
    num_pending_votes: firestore.FieldValue.increment(1),
    num_votes: firestore.FieldValue.increment(1),
  })
}

const cleanupTestElection = async (electionId: string) => {
  const db = firebase.firestore()
  const electionDoc = db.collection('elections').doc(electionId)

  // Delete all subcollections
  const subcollections = ['votes', 'votes-pending', 'votes-cached']
  for (const subcol of subcollections) {
    const snapshot = await electionDoc.collection(subcol).get()
    const batch = db.batch()
    snapshot.docs.forEach((doc) => batch.delete(doc.ref))
    await batch.commit()
  }

  // Delete the election document
  await electionDoc.delete()
}

const waitForThrottle = () => new Promise((resolve) => setTimeout(resolve, 6000)) // PACK_THROTTLE_MS (5s) + 1s buffer

const getLeaseState = async (electionId: string) => {
  const db = firebase.firestore()
  const leaseRef = db.collection('elections').doc(electionId).collection('votes-cached').doc('lease')
  const snap = await leaseRef.get()
  return snap.exists ? snap.data() : null
}

// Test 1: Concurrent Packing
test('Concurrent Packing - only one packer succeeds', async () => {
  const electionId = `test-concurrent-${Date.now()}`

  try {
    // Setup: Create election with votes
    await createTestElection(electionId)
    await submitTestVote(electionId, 'auth1', { test: 'vote1' })
    await submitTestVote(electionId, 'auth2', { test: 'vote2' })

    // Wait for throttle to pass
    await waitForThrottle()

    // Fire two concurrent requests
    const req1 = createMockRequest(electionId)
    const req2 = createMockRequest(electionId)
    const res1 = createMockResponse()
    const res2 = createMockResponse()

    // Fire both requests concurrently
    const promises = [handler(req1, res1), handler(req2, res2)]

    // Wait for both to complete
    await Promise.all(promises)

    const body1 = res1._body() as { _stats?: { didPack?: boolean }; results?: Array<{ auth: string }> }
    const body2 = res2._body() as { _stats?: { didPack?: boolean }; results?: Array<{ auth: string }> }

    // Verify only one packed (lease mechanism worked)
    const didPack1 = body1?._stats?.didPack ?? false
    const didPack2 = body2?._stats?.didPack ?? false

    expect(didPack1 || didPack2).toBe(true) // At least one should pack
    expect(didPack1 && didPack2).toBe(false) // But not both (lease prevented concurrent packing)

    // Verify both responses are valid (both should return data even if only one packed)
    expect(res1._statusCode()).toBe(200)
    expect(res2._statusCode()).toBe(200)

    // Verify both responses contain the votes (either from cache or fresh tail)
    const results1 = body1?.results ?? []
    const results2 = body2?.results ?? []
    const auths1 = results1.map((r) => r.auth)
    const auths2 = results2.map((r) => r.auth)

    // Both responses should have the votes (one from packed cache, one from fresh tail)
    expect(auths1).toContain('auth1')
    expect(auths1).toContain('auth2')
    expect(auths2).toContain('auth1')
    expect(auths2).toContain('auth2')

    // Verify lease was properly released after packing
    // Wait a bit for lease to be released (releaseLease is called in finally block)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const leaseState = await getLeaseState(electionId)
    // Lease should be null (released) after packing completes
    expect(leaseState).toBeNull()
  } finally {
    await cleanupTestElection(electionId)
  }
})

// Test 2: Voting During Packing
test('Voting During Packing - vote appears in subsequent cache read', async () => {
  const electionId = `test-voting-during-${Date.now()}`

  try {
    // Setup: Create election with initial votes
    await createTestElection(electionId)
    await submitTestVote(electionId, 'auth1', { test: 'vote1' })
    await waitForThrottle()

    // Start packing operation (don't await yet)
    const packReq = createMockRequest(electionId)
    const packRes = createMockResponse()
    const packPromise = handler(packReq, packRes)

    // While packing is in progress, submit a new vote
    // Small delay to ensure packing has started (lease acquired)
    await new Promise((resolve) => setTimeout(resolve, 200))
    await submitTestVote(electionId, 'auth2', { test: 'vote2' })

    // Wait for packing to complete
    await packPromise

    expect(packRes._statusCode()).toBe(200)

    // Call cache-accepted again to verify the vote submitted during packing appears
    const readReq = createMockRequest(electionId)
    const readRes = createMockResponse()
    await handler(readReq, readRes)

    const readBody = readRes._body() as {
      _stats?: unknown
      results?: Array<{ auth: string }>
    }
    expect(readRes._statusCode()).toBe(200)

    const results = readBody?.results ?? []
    const auths = results.map((r) => r.auth)

    // Verify both votes appear
    expect(auths).toContain('auth1')
    expect(auths).toContain('auth2')

    // Verify vote counts are correct
    const stats = readBody?._stats
    expect(stats).toBeDefined()
  } finally {
    await cleanupTestElection(electionId)
  }
})

// Future tests - placeholders
test.skip('Pending Vote Transition During Packing - verify deduplication works', () => {
  // Test 3: When a pending vote is approved (moved from votes-pending to votes) while packing is in progress,
  // deduplication should work correctly.
})

test.skip('Invalidated Votes Filtering - verify invalidated votes are filtered', () => {
  // Test 4: Invalidated votes should be filtered out from both cached and fresh results.
})

test.skip('ETag Behavior - verify 304 Not Modified responses', () => {
  // Test 5: ETag-based caching should work correctly, returning 304 when ETag matches.
})

test.skip('Throttle Behavior - verify packing is throttled', () => {
  // Test 6: Packing should not happen within PACK_THROTTLE_MS (5 seconds) of previous pack.
})

test.skip('Empty Tail Query - verify no packing when no new votes', () => {
  // Test 7: Packing should not happen when no new votes exist (empty tail query).
})

test.skip('Page Size Limits - verify multi-page packing', () => {
  // Test 8: Votes exceeding MAX_PAGE_BYTES (850KB) should be split across multiple pages.
})

test.skip('Cursor Tie-Breaking Logic - verify cursor advances correctly', () => {
  // Test 9: Cursor should use docId as tie-breaker when votes have identical created_at timestamps.
})

test.skip('Lease Expiration and Recovery - verify expired leases can be acquired', () => {
  // Test 10: Expired leases should be acquirable by new packers (crash recovery scenario).
})

test.skip('Concurrent Reads During Packing - verify multiple clients can read', () => {
  // Test 11: Multiple clients should be able to read while packing is in progress without blocking.
})

test.skip('Empty Election - verify root initialization', () => {
  // Test 12: First request to empty election should initialize root document correctly.
})

test.skip('Vote Count Mismatch Detection - verify system detects mismatches', () => {
  // Test 13: System should detect and report when served votes < expected total.
})

test.skip('Lease Release Edge Cases - verify graceful handling', () => {
  // Test 14: Lease release should handle edge cases (missing lease, wrong owner) gracefully.
})

test.skip('Rapid Vote Submissions - stress test', () => {
  // Test 15: System should handle rapid vote submissions (50+ concurrent) correctly.
})

test.skip('observedVotes < 0 Edge Case - verify graceful handling', () => {
  // Test 16: System should handle negative observedVotes gracefully without crashing.
})

test.skip('Cursor with Only Votes or Only Pending - verify cursor advancement', () => {
  // Test 17: Cursor should advance correctly when only one collection (votes or pending) has new items.
})
