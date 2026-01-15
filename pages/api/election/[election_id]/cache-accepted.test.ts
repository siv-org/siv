import { expect, test } from 'bun:test'

const API_BASE = 'http://localhost:3001/api'

// Helper to call cache-accepted endpoint
const callCacheAccepted = async (electionId: string, headers: Record<string, string> = {}) => {
  const response = await fetch(`${API_BASE}/election/${electionId}/cache-accepted`, { headers: { ...headers } })
  const body = await response.json()
  return { body, headers: Object.fromEntries(response.headers.entries()), status: response.status }
}

// Helper to create a test election
const createTestElection = async (electionId: string, electionTitle?: string) => {
  const response = await fetch(`${API_BASE}/test/create-election`, {
    body: JSON.stringify({ election_id: electionId, election_title: electionTitle }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  const body = await response.json()
  return { body, status: response.status }
}

// Helper to cleanup a test election
const cleanupTestElection = async (electionId: string) => {
  const response = await fetch(`${API_BASE}/test/cleanup-election?election_id=${electionId}`, { method: 'DELETE' })
  return response
}

// Helper to create voters with specific auth tokens
const createTestVoters = async (electionId: string, voters: Array<{ auth_token: string; email?: string }>) => {
  const response = await fetch(`${API_BASE}/test/create-voters`, {
    body: JSON.stringify({ election_id: electionId, voters }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  const body = await response.json()
  return { body, status: response.status }
}

// Helper to submit a vote via the API
const submitTestVote = async (electionId: string, auth: string, encryptedVote: Record<string, unknown> = {}) => {
  const response = await fetch(`${API_BASE}/submit-vote`, {
    body: JSON.stringify({ auth, election_id: electionId, encrypted_vote: encryptedVote }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  return response
}

const waitForThrottle = () => new Promise((resolve) => setTimeout(resolve, 6000)) // PACK_THROTTLE_MS (5s) + 1s buffer

// Test 1: Concurrent Packing
test('Concurrent Packing - only one packer succeeds', async () => {
  const electionId = `test-concurrent-${Date.now()}`

  try {
    // Setup: Create election with voters and votes
    const createResponse = await createTestElection(electionId)
    expect(createResponse.status).toBe(201)

    // Create voters with known auth tokens
    const createVotersResponse = await createTestVoters(electionId, [
      { auth_token: 'a1b2c3d4e5' },
      { auth_token: 'b1c2d3e4f5' },
    ])
    expect(createVotersResponse.status).toBe(201)

    const submitResponse1 = await submitTestVote(electionId, 'a1b2c3d4e5', { test: 'vote1' })
    const submitResponse1Body = await submitResponse1.json()
    expect(submitResponse1.status, submitResponse1Body?.error).toBe(200)
    const submitResponse2 = await submitTestVote(electionId, 'b1c2d3e4f5', { test: 'vote2' })
    const submitResponse2Body = await submitResponse2.json()
    expect(submitResponse2.status, submitResponse2Body?.error).toBe(200)

    // Wait for throttle to pass
    await waitForThrottle()

    // Fire two concurrent requests to the actual API
    const [response1, response2] = await Promise.all([callCacheAccepted(electionId), callCacheAccepted(electionId)])

    const body1 = response1.body as { _stats?: { didPack?: boolean }; results?: Array<{ auth: string }> }
    const body2 = response2.body as { _stats?: { didPack?: boolean }; results?: Array<{ auth: string }> }

    // Verify only one packed (lease mechanism worked)
    const didPack1 = body1?._stats?.didPack ?? false
    const didPack2 = body2?._stats?.didPack ?? false

    expect(didPack1 || didPack2).toBe(true) // At least one should pack
    expect(didPack1 && didPack2).toBe(false) // But not both (lease prevented concurrent packing)

    // Verify both responses are valid (both should return data even if only one packed)
    expect(response1.status).toBe(200)
    expect(response2.status).toBe(200)

    // Verify both responses contain the votes (either from cache or fresh tail)
    const results1 = body1?.results ?? []
    const results2 = body2?.results ?? []
    const auths1 = results1.map((r) => r.auth)
    const auths2 = results2.map((r) => r.auth)

    // Both responses should have the votes (one from packed cache, one from fresh tail)
    expect(auths1).toContain('a1b2c3d4e5')
    expect(auths1).toContain('b1c2d3e4f5')

    expect(auths2).toContain('a1b2c3d4e5')
    expect(auths2).toContain('b1c2d3e4f5')
  } finally {
    await cleanupTestElection(electionId)
  }
})

// Test 2: Voting During Packing
test.skip('Voting During Packing - vote appears in subsequent cache read', async () => {
  const electionId = `test-voting-during-${Date.now()}`

  try {
    // Setup: Create election with voters and initial votes
    const createResponse = await createTestElection(electionId)
    expect(createResponse.status).toBe(201)

    // Create voters with known auth tokens
    const createVotersResponse = await createTestVoters(electionId, [
      { auth_token: 'a1b2c3d4e5' },
      { auth_token: 'b1c2d3e4f5' },
    ])
    expect(createVotersResponse.status).toBe(201)

    await submitTestVote(electionId, 'a1b2c3d4e5', { test: 'vote1' })
    await waitForThrottle()

    // Start packing operation (don't await yet)
    const packPromise = callCacheAccepted(electionId)

    // While packing is in progress, submit a new vote
    // Small delay to ensure packing has started (lease acquired)
    await new Promise((resolve) => setTimeout(resolve, 200))
    await submitTestVote(electionId, 'b1c2d3e4f5', { test: 'vote2' })

    // Wait for packing to complete
    const packResponse = await packPromise
    expect(packResponse.status).toBe(200)

    // Call cache-accepted again to verify the vote submitted during packing appears
    const readResponse = await callCacheAccepted(electionId)
    expect(readResponse.status).toBe(200)

    const readBody = readResponse.body as {
      _stats?: unknown
      results?: Array<{ auth: string }>
    }

    const results = readBody?.results ?? []
    const auths = results.map((r) => r.auth)

    // Verify both votes appear
    expect(auths).toContain('a1b2c3d4e5')
    expect(auths).toContain('b1c2d3e4f5')

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
