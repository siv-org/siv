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
  return fetch(`${API_BASE}/submit-vote`, {
    body: JSON.stringify({ auth, election_id: electionId, encrypted_vote: JSON.stringify(encryptedVote) }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
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
    expect(submitResponse1.status).toBe(200)

    const submitResponse2 = await submitTestVote(electionId, 'b1c2d3e4f5', { test: 'vote2' })
    expect(submitResponse2.status).toBe(200)

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
}, 30000) // 30s timeout to allow for throttle wait

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

/*
## Additional Edge Cases to Test

### Test 3: Pending Vote Transition During Packing

**Goal**: Verify that when a pending vote is approved (moved from `votes-pending` to `votes`) while packing is in progress, deduplication works correctly.

**Steps**:

1. Create election with pending votes
2. Start packing operation
3. While packing, approve a pending vote (via `/api/election/[election_id]/admin/approve-pending-vote`)
4. Verify:

- Packed pending vote is not duplicated in response
- Accepted vote appears correctly
- Deduplication removes pending vote with matching `link_auth`

### Test 4: Invalidated Votes Filtering

**Goal**: Verify invalidated votes are filtered out from both cached and fresh results.

**Steps**:

1. Create election with votes (some cached, some fresh)
2. Invalidate a vote via `/api/election/[election_id]/admin/invalidate-voters`
3. Call `/cache-accepted` and verify:

- Invalidated vote is filtered from cached pages
- Invalidated vote is filtered from fresh tail query
- Pending votes with matching `link_auth` are also filtered
- `filtered_invalidated` count is correct

### Test 5: ETag Behavior (304 Not Modified)

**Goal**: Verify ETag-based caching works correctly.

**Steps**:

1. Call `/cache-accepted` and capture ETag
2. Call again with `If-None-Match` header set to ETag
3. Verify 304 response (no body)
4. Submit new vote
5. Call again with old ETag
6. Verify 200 response with new data and new ETag

**Key assertions**:

- ETag changes when votes are added (even if not packed)
- ETag is based on cursor + observed counters
- 304 responses save bandwidth

### Test 6: Throttle Behavior

**Goal**: Verify packing is throttled correctly.

**Steps**:

1. Create election and trigger packing
2. Immediately call `/cache-accepted` again (within `PACK_THROTTLE_MS`)
3. Verify `didPack: false` (throttle active)
4. Wait `PACK_THROTTLE_MS + buffer`
5. Call again with new votes
6. Verify `didPack: true` (throttle passed)

### Test 7: Empty Tail Query (No Packing)

**Goal**: Verify packing doesn't happen when no new votes exist.

**Steps**:

1. Create election and pack initial votes
2. Call `/cache-accepted` with no new votes
3. Verify `didPack: false`
4. Verify response still serves cached votes correctly

### Test 8: Page Size Limits (Multi-Page Packing)

**Goal**: Verify votes exceeding `MAX_PAGE_BYTES` (850KB) are split across multiple pages.

**Steps**:

1. Create election with many large votes (exceeding page size)
2. Trigger packing
3. Verify:

- Multiple pages are created (`000001`, `000002`, etc.)
- `currentPageNum` advances correctly
- All votes are packed across pages
- Page IDs are zero-padded for lexicographic ordering

### Test 9: Cursor Tie-Breaking Logic

**Goal**: Verify cursor advances correctly when votes and pending votes have same `created_at`.

**Steps**:

1. Create votes with identical `created_at` timestamps
2. Ensure some are in `votes` and some in `votes-pending`
3. Trigger packing
4. Verify cursor uses `docId` as tie-breaker (lexicographic order)
5. Verify cursor advances to `max(lastVote, lastPending)` under ordering

### Test 10: Lease Expiration and Recovery

**Goal**: Verify expired leases can be acquired by new packers (crash recovery).

**Steps**:

1. Manually create a lease document with expired `expiresAt`
2. Attempt to pack
3. Verify lease is acquired successfully
4. Verify packing proceeds normally

### Test 11: Concurrent Reads During Packing

**Goal**: Verify multiple clients can read while packing is in progress.

**Steps**:

1. Start packing operation
2. Fire multiple concurrent read requests to `/cache-accepted`
3. Verify:

- All reads succeed (no blocking)
- Reads return consistent data (cached + fresh tail)
- No errors or race conditions

### Test 12: Empty Election (Root Initialization)

**Goal**: Verify first request to empty election initializes root correctly.

**Steps**:

1. Create election with no votes
2. Call `/cache-accepted`
3. Verify:

- Root document is created with correct initial state
- `currentPageNum = 1`
- `lastPackedCreatedAt = null`
- `updatedAt` is set to allow immediate packing
- Response is empty but valid

### Test 13: Vote Count Mismatch Detection

**Goal**: Verify system detects and reports when served votes < expected total.

**Steps**:

1. Create election with known vote count
2. Manually corrupt cache (delete some pages or votes)
3. Call `/cache-accepted`
4. Verify:

- Pushover alert is sent (if implemented)
- Response still returns available votes
- Mismatch is logged in stats

### Test 14: Lease Release Edge Cases

**Goal**: Verify lease release handles edge cases gracefully.

**Steps**:

1. Acquire lease and pack
2. Manually delete lease document
3. Attempt to release lease
4. Verify pushover alert is sent (lease not found)
5. Verify no errors crash the endpoint

### Test 15: Rapid Vote Submissions (Stress Test)

**Goal**: Verify system handles rapid vote submissions correctly.

**Steps**:

1. Create election
2. Submit 50+ votes rapidly (concurrent submissions)
3. Call `/cache-accepted` multiple times
4. Verify:

- All votes are eventually packed
- No votes are lost
- Cursor advances correctly
- No race conditions cause data corruption

### Test 16: observedVotes < 0 Edge Case

**Goal**: Verify system handles negative observedVotes gracefully.

**Steps**:

1. Manually corrupt election document to have `num_votes < num_pending_votes`
2. Call `/cache-accepted`
3. Verify:

- Pushover alert is sent
- Endpoint doesn't crash
- Response still works (with corrected calculation)

### Test 17: Cursor with Only Votes or Only Pending

**Goal**: Verify cursor advancement when only one collection has new items.

**Steps**:

1. Create election with only accepted votes (no pending)
2. Pack and verify cursor advances
3. Create election with only pending votes (no accepted)
4. Pack and verify cursor advances
5. Verify cursor logic handles both cases correctly

## Expected Behavior

1. **Concurrent packing**: One succeeds, one fails gracefully (returns `didPack: false`)
2. **Voting during packing**: Vote is accepted and appears in next cache read
3. **Lease expiration**: Expired leases can be acquired by new packers
4. **Data integrity**: No votes lost, no duplicates, cursor always advances
5. **Deduplication**: Pending votes that become accepted are deduplicated correctly
6. **Invalidation**: Invalidated votes are filtered from all responses
7. **ETag caching**: 304 responses work correctly, ETag changes with data
8. **Throttling**: Packing respects throttle window
9. **Multi-page**: Large vote sets split across pages correctly
10. **Tie-breaking**: Cursor uses docId for tie-breaking when timestamps match
*/
