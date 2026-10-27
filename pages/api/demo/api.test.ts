import type { NextApiRequest, NextApiResponse } from 'next'

import { afterAll, beforeAll, beforeEach, describe, expect, mock, test } from 'bun:test'
import { random_bigint, RP, stringToPoint } from 'src/crypto/curve'
import { encrypt } from 'src/crypto/encrypt'
import { BALLOT_METHODS, BallotMethod, sharedDemoElectionId } from 'src/demo/interactiveDemo/content'
import { generateColumnNames } from 'src/vote/generateColumnNames'

// In-memory Firestore harness: no credentials or network are used by these tests.
type Data = Record<string, unknown>
type Ref = {
  collection: (name: string) => Ref
  doc: (id: string) => Ref
  get: () => Promise<Snapshot>
  id: string
  path: string
  update: (data: Data) => Promise<void>
}
type Snapshot = { data: () => Data | undefined; docs: Snapshot[]; exists: boolean; size: number }
type Transaction = {
  create: (doc: Ref, data: Data) => void
  get: (doc: Ref) => Promise<Snapshot>
  update: (doc: Ref, data: Data) => void
}
const records = new Map<string, Data>()
const adminEmail = 'demo-admin@test.local'
const originalAdminEmail = process.env.ADMIN_EMAIL
let transactions: Promise<unknown> = Promise.resolve()
let onPublish: (() => Promise<void>) | undefined
function ref(path: string): Ref {
  return {
    collection: (name) => ref(`${path}/${name}`),
    doc: (id) => ref(`${path}/${id}`),
    get: async () => snapshot(path),
    id: path.slice(path.lastIndexOf('/') + 1),
    path,
    update: async (data) => {
      await onPublish?.()
      records.set(path, { ...records.get(path), ...data })
    },
  }
}
function snapshot(path: string): Snapshot {
  const children = [...records.keys()].filter(
    (key) => key.startsWith(`${path}/`) && key.split('/').length === path.split('/').length + 1,
  )
  return {
    data: () => records.get(path),
    docs: children.map((key) => ({ data: () => records.get(key), docs: [], exists: true, size: 0 })),
    exists: records.has(path),
    size: children.length,
  }
}
const db = {
  collection: (name: string) => ref(name),
  runTransaction: (fn: (transaction: Transaction) => unknown) => {
    // Serialize transactions like Firestore's retry/commit behavior for contended documents.
    const run = transactions.then(() =>
      fn({
        create: (doc, data) => {
          if (records.has(doc.path)) throw new Error('Already exists')
          records.set(doc.path, data)
        },
        get: (doc) => doc.get(),
        update: (doc, data) => {
          records.set(doc.path, { ...records.get(doc.path), ...data })
        },
      }),
    )
    transactions = run.catch(() => {})
    return run
  },
}
const pushover = mock<(...args: string[]) => Promise<void>>(async () => {})
mock.module('api/_services', () => ({ firebase: { firestore: () => db }, pushover }))
mock.module('api/pusher', () => ({ pusher: { trigger: mock(async () => {}) } }))
let mintAuthToken: typeof import('./mint-auth-token').default
let unlockResultsEndpoint: typeof import('./[election_id]/unlock-results').default
let createDemoElection: typeof import('./create-elections').createDemoElection
let creation: typeof import('./create-elections')
let unlockDemoBallots: typeof import('./[election_id]/unlock-results').unlockDemoBallots
beforeAll(async () => {
  // Load server modules after the mocks above, so tests never initialize real services.
  mintAuthToken = (await import('./mint-auth-token')).default
  const unlock = await import('./[election_id]/unlock-results')
  unlockResultsEndpoint = unlock.default
  unlockDemoBallots = unlock.unlockDemoBallots
  creation = await import('./create-elections')
  createDemoElection = creation.createDemoElection
})
function cast(election_id: string, auth: string, tracking: string, choice = 'Jordan Park') {
  const election = records.get(`elections/${election_id}`)
  const cipher = encrypt(
    RP.fromHex(String(election?.threshold_public_key)),
    random_bigint(),
    stringToPoint(`${tracking}:${choice}`),
  )
  records.set(`elections/${election_id}/votes/${auth}`, {
    auth,
    encrypted_vote: { vote: { encrypted: cipher.encrypted.toHex(), lock: cipher.lock.toHex() } },
  })
  records.set(`elections/${election_id}`, { ...election, num_votes: Number(election?.num_votes) + 1 })
}
async function refresh(election_id: string) {
  const { res, state } = response()
  await unlockResultsEndpoint(request({}, { query: { election_id } }), res)
  return state
}
async function register(method: BallotMethod = 'plurality') {
  await createDemoElection(method)
  const { res, state } = response()
  await mintAuthToken(request({ method }), res)
  expect(state.status).toBe(201)
  expect(Object.keys(state.body)).toEqual(['auth'])
  return { ...state.body, election_id: sharedDemoElectionId(method) }
}
function request(body: Record<string, unknown> = {}, options: Partial<NextApiRequest> = {}) {
  return {
    body,
    headers: {},
    method: 'POST',
    query: {},
    socket: { remoteAddress: '127.0.0.1' },
    ...options,
  } as NextApiRequest
}
function response() {
  const state = {
    body: {} as {
      auth: string
      election_id: string
      refreshing?: boolean
      secret?: string
      session_token?: string
    },
    status: 200,
  }
  const res = {
    end: () => res,
    json: (body: unknown) => {
      state.body = body as typeof state.body
      return res
    },
    setHeader: () => res,
    status: (status: number) => {
      state.status = status
      return res
    },
  }
  return { res: res as unknown as NextApiResponse, state }
}
beforeEach(() => {
  process.env.ADMIN_EMAIL = adminEmail
  records.clear()
  transactions = Promise.resolve()
  onPublish = undefined
  pushover.mockClear()
})
afterAll(() => {
  if (originalAdminEmail === undefined) delete process.env.ADMIN_EMAIL
  else process.env.ADMIN_EMAIL = originalAdminEmail
})

describe('SIV demo using shared backend', () => {
  test('visitors share one election, but each receives a unique registered Voter Code', async () => {
    const first = await register()
    const key = records.get(`elections/${first.election_id}/trustees/${adminEmail}`)?.private_keyshare
    const second = await register()
    expect(second.election_id).toBe(first.election_id)
    expect(second.auth).not.toBe(first.auth)
    for (const visitor of [first, second]) {
      expect(visitor.auth).toMatch(/^[a-f0-9]{10}$/)
      expect(records.get(`elections/${visitor.election_id}/voters/${visitor.auth}`)?.auth_token).toBe(visitor.auth)
    }
    expect([...records.keys()].filter((key) => /^elections\/[^/]+$/.test(key))).toHaveLength(1)
    expect(records.get(`elections/${first.election_id}`)?.num_votes).toBe(24)
    expect(records.get(`elections/${first.election_id}`)?.num_voters).toBe(26)
    expect(records.get(`elections/${first.election_id}/trustees/${adminEmail}`)?.private_keyshare).toBe(key)
    expect(records.get(`elections/${first.election_id}`)?.secret).toBeUndefined()
    expect(records.get(`elections/${first.election_id}`)?.private_keyshare).toBeUndefined()
    expect(records.get(`elections/${first.election_id}`)?.t).toBe(1)
  })

  test('new mayoral elections use fictional candidates, party subtitles, and randomized order', async () => {
    for (const { id } of BALLOT_METHODS.filter(({ id }) => id !== 'budget')) {
      await createDemoElection(id)
      const election = records.get(`elections/${sharedDemoElectionId(id)}`)
      expect(election?.election_title).toBe('City Mayoral Election')
      const [design] = JSON.parse(String(election?.ballot_design))
      expect(design.randomize_order).toBe(true)
      expect(design.options).toEqual([
        { name: 'Sam Navarro', sub: 'Silver Party' },
        { name: 'Alex Okafor', sub: 'Gold Party' },
        { name: 'Jordan Park', sub: 'Violet Party' },
        { name: 'Casey Dubois', sub: 'Teal Party' },
      ])
    }
  })

  test('different ballot methods have different shared elections', async () => {
    const one = await register('plurality')
    const approval = await register('approval')
    expect(one.election_id).not.toBe(approval.election_id)
    expect(JSON.parse(String(records.get(`elections/${approval.election_id}`)?.ballot_design))[0].type).toBe('approval')
  })

  test('concurrent setup and registration keep the same key and seed ballots only once', async () => {
    const visitors = await Promise.all(Array.from({ length: 5 }, () => register()))
    const id = visitors[0].election_id
    expect(new Set(visitors.map((v) => v.election_id)).size).toBe(1)
    expect(new Set(visitors.map((v) => v.auth)).size).toBe(5)
    expect(records.get(`elections/${id}`)?.num_voters).toBe(29)
    expect([...records.keys()].filter((key) => key.startsWith(`elections/${id}/votes/`))).toHaveLength(24)
  })

  test('rejects unsupported methods and malformed request bodies', async () => {
    for (const [body, options] of [
      [{ method: 'custom' }, {}],
      [{ method: false }, {}],
      [{ method: '' }, {}],
      [{}, { body: null }],
      [{}, { body: [] }],
    ] as const) {
      const { res, state } = response()
      await mintAuthToken(request(body, options), res)
      expect(state.status).toBeGreaterThanOrEqual(400)
    }
    expect(records.size).toBe(0)
  })

  test('both mutation endpoints reject non-POST requests', async () => {
    for (const handler of [mintAuthToken, unlockResultsEndpoint]) {
      for (const options of [{ method: 'GET' }]) {
        const { res, state } = response()
        await handler(request({}, options), res)
        expect(state.status).toBe(405)
      }
    }
    expect(records.size).toBe(0)
  })

  test('registration never creates a missing demo election', async () => {
    const { res, state } = response()
    await mintAuthToken(request({}), res)
    expect(state.status).toBe(503)
    expect(records.size).toBe(0)
  })

  test('unexpected registration errors propagate to Next.js without issuing a code', async () => {
    transactions = Promise.reject(new Error('Database unavailable'))
    const { res, state } = response()
    await expect(mintAuthToken(request({}), res)).rejects.toThrow('Database unavailable')
    expect(Object.keys(state.body)).toHaveLength(0)
    expect(records.size).toBe(0)
  })

  test('registration rejects unmarked-as-demo or closed elections without adding voters', async () => {
    const path = `elections/${sharedDemoElectionId('plurality')}`
    for (const data of [{ is_demo: false }, { is_demo: true, stop_accepting_votes: true }]) {
      records.set(path, data)
      const { res, state } = response()
      await mintAuthToken(request({}), res)
      expect(state.status).toBe(503)
      expect(records.size).toBe(1)
      expect(records.get(path)).toBe(data)
    }
  })

  test('setup is idempotent and refuses to overwrite a conflicting election or orphaned key', async () => {
    expect(await createDemoElection('plurality')).toBe(true)
    const id = sharedDemoElectionId('plurality')
    const election = records.get(`elections/${id}`)
    const key = records.get(`elections/${id}/trustees/${adminEmail}`)
    expect(await createDemoElection('plurality')).toBe(false)
    expect(records.get(`elections/${id}`)).toBe(election)
    expect(records.get(`elections/${id}/trustees/${adminEmail}`)).toBe(key)
    records.set(`elections/${id}`, { is_demo: false })
    await expect(createDemoElection('plurality')).rejects.toThrow('Refusing to overwrite')
    records.delete(`elections/${id}`)
    await expect(createDemoElection('plurality')).rejects.toThrow('orphaned key')
    expect(records.get(`elections/${id}/trustees/${adminEmail}`)).toBe(key)
  })

  test('setup and unlocking require the configured server trustee', async () => {
    delete process.env.ADMIN_EMAIL
    await expect(createDemoElection('plurality')).rejects.toThrow('Missing process.env.ADMIN_EMAIL')
    expect((await refresh(sharedDemoElectionId('plurality'))).status).toBe(501)
    expect(records.size).toBe(0)
  })

  test('repeated result refreshes include later votes and never close voting', async () => {
    const first = await register()
    expect((await refresh(first.election_id)).status).toBe(200)
    cast(first.election_id, first.auth, '1234-1234-1234')
    expect((await refresh(first.election_id)).status).toBe(200)
    let election = records.get(`elections/${first.election_id}`)
    expect(election?.decrypted).toContainEqual({ tracking: '1234-1234-1234', vote: 'Jordan Park' })
    expect(election?.decrypted).toHaveLength(25)
    const second = await register()
    cast(second.election_id, second.auth, '5678-5678-5678', 'Casey Dubois')
    expect((await refresh(second.election_id)).status).toBe(200)
    election = records.get(`elections/${second.election_id}`)
    expect(election?.decrypted).toContainEqual({ tracking: '5678-5678-5678', vote: 'Casey Dubois' })
    expect(election?.decrypted).toHaveLength(26)
    expect(election?.stop_accepting_votes).toBe(false)
  })

  test('receipt replacements are refreshed even when the number of votes does not change', async () => {
    const visitor = await register()
    cast(visitor.election_id, visitor.auth, '1234-1234-1234')
    await refresh(visitor.election_id)
    cast(visitor.election_id, visitor.auth, '5678-5678-5678', 'Casey Dubois')
    const path = `elections/${visitor.election_id}`
    records.set(path, { ...records.get(path), num_votes: 25 })
    expect((await refresh(visitor.election_id)).status).toBe(200)
    expect(records.get(path)?.decrypted).toContainEqual({ tracking: '5678-5678-5678', vote: 'Casey Dubois' })
    expect(records.get(path)?.decrypted).not.toContainEqual({ tracking: '1234-1234-1234', vote: 'Jordan Park' })
    expect(records.get(path)?.decrypted).toHaveLength(25)
  })

  test('matches normal SIV results: skip blank selections and pad tracking numbers', async () => {
    const visitor = await register()
    cast(visitor.election_id, visitor.auth, '123-1234-1234')
    expect((await refresh(visitor.election_id)).status).toBe(200)
    const path = `elections/${visitor.election_id}`
    expect(records.get(path)?.decrypted).toContainEqual({ tracking: '0123-1234-1234', vote: 'Jordan Park' })
    cast(visitor.election_id, visitor.auth, '123-1234-1234', 'BLANK')
    expect((await refresh(visitor.election_id)).status).toBe(200)
    expect(records.get(path)?.decrypted).toHaveLength(24)
    expect(records.get(path)?.decrypted).not.toContainEqual({ tracking: '0123-1234-1234', vote: 'BLANK' })
  })

  test('concurrent refreshes both succeed; unchanged results are reused', async () => {
    const visitor = await register()
    const replies = await Promise.all([refresh(visitor.election_id), refresh(visitor.election_id)])
    expect(replies.map((reply) => reply.status)).toEqual([200, 200])
    const decrypted = records.get(`elections/${visitor.election_id}`)?.decrypted
    expect((await refresh(visitor.election_id)).status).toBe(200)
    expect(records.get(`elections/${visitor.election_id}`)?.decrypted).toBe(decrypted)
  })

  test('last write wins without deleting votes; the next unlock includes later votes again', async () => {
    const first = await register()
    const paused = Promise.withResolvers<undefined>()
    const resume = Promise.withResolvers<undefined>()
    onPublish = async () => {
      onPublish = undefined
      paused.resolve(undefined)
      await resume.promise
    }
    const olderRefresh = refresh(first.election_id)
    await paused.promise
    const second = await register()
    cast(second.election_id, second.auth, '5678-5678-5678', 'Casey Dubois')
    expect((await refresh(second.election_id)).status).toBe(200)
    const path = `elections/${first.election_id}`
    expect(records.get(path)?.decrypted).toHaveLength(25)
    resume.resolve(undefined)
    expect((await olderRefresh).status).toBe(200)
    expect(records.get(path)?.decrypted).toHaveLength(24)
    expect(records.has(`${path}/votes/${second.auth}`)).toBe(true)
    expect((await refresh(first.election_id)).status).toBe(200)
    expect(records.get(path)?.decrypted).toContainEqual({ tracking: '5678-5678-5678', vote: 'Casey Dubois' })
  })

  test('never unlocks ordinary or old per-visitor elections', async () => {
    expect((await refresh('ordinary-election')).status).toBe(400)
    expect((await refresh('demo-old-per-visitor')).status).toBe(400)
    const id = sharedDemoElectionId('plurality')
    records.set(`elections/${id}`, { is_demo: false })
    records.set(`elections/${id}/trustees/${adminEmail}`, { private_keyshare: '1' })
    expect((await refresh(id)).status).toBe(404)
    expect(records.get(`elections/${id}`)?.decrypted).toBeUndefined()
  })

  test('a failed refresh preserves published results and leaves the election open', async () => {
    const visitor = await register()
    await refresh(visitor.election_id)
    const decrypted = records.get(`elections/${visitor.election_id}`)?.decrypted
    records.set(`elections/${visitor.election_id}/votes/bad`, { encrypted_vote: {} })
    records.set(`elections/${visitor.election_id}`, {
      ...records.get(`elections/${visitor.election_id}`),
      num_votes: 25,
    })
    await expect(refresh(visitor.election_id)).rejects.toThrow()
    expect(records.get(`elections/${visitor.election_id}`)?.decrypted).toBe(decrypted)
    expect(records.get(`elections/${visitor.election_id}`)?.stop_accepting_votes).toBe(false)
  })

  test('malformed decrypted values are skipped and reported using the production path', async () => {
    const visitor = await register()
    cast(visitor.election_id, visitor.auth, 'invalid')
    expect((await refresh(visitor.election_id)).status).toBe(200)
    expect(records.get(`elections/${visitor.election_id}`)?.decrypted).toHaveLength(24)
    expect(pushover).toHaveBeenCalledTimes(1)
    expect(pushover.mock.calls[0]?.[1]).toContain(visitor.election_id)
  })
})

describe('backend demo ballots using production decryption', () => {
  for (const { id } of BALLOT_METHODS) {
    test(`${id}: seeded ciphertexts unlock into complete, consistent ballots`, async () => {
      const { makeDemoBallots, SAMPLE_COUNT } = creation
      const { design, publicKey, samples, secret } = makeDemoBallots(id)
      const { columns } = generateColumnNames({ ballot_design: [design] })
      expect(samples).toHaveLength(SAMPLE_COUNT)
      samples.forEach((sample) => expect(Object.keys(sample)).toEqual(columns))
      const rows = await unlockDemoBallots(secret, samples, columns)
      expect(rows).toHaveLength(SAMPLE_COUNT)
      expect(new Set(rows.map((row) => row.tracking)).size).toBe(SAMPLE_COUNT)
      rows.forEach((row) => {
        expect(Object.keys(row).every((key) => key === 'tracking' || columns.includes(key))).toBe(true)
        for (const column of columns) {
          if (id === 'score') {
            expect(Number.isInteger(Number(row[column]))).toBe(true)
            expect(Number(row[column])).toBeGreaterThanOrEqual(Number(design.min_score))
            expect(Number(row[column])).toBeLessThanOrEqual(Number(design.max_score))
          } else if (id === 'budget') expect(Number(row[column])).toBeGreaterThanOrEqual(0)
          else if (row[column] !== undefined) expect(design.options.map((option) => option.name)).toContain(row[column])
        }
        if (id === 'budget') expect(columns.reduce((sum, column) => sum + Number(row[column]), 0)).toBe(100_000)
      })

      // Calling unlock twice should give the same results
      expect(await unlockDemoBallots(secret, samples, columns)).toEqual(rows)

      expect(RP.fromHex(publicKey)).toBeDefined()
    }, 30_000)
  }

  test('invalid ciphertexts still reject the unlock', async () => {
    const { makeDemoBallots } = creation
    const { secret } = makeDemoBallots('plurality')
    await expect(
      unlockDemoBallots(secret, [{ vote: { encrypted: 'invalid', lock: 'invalid' } }], ['vote']),
    ).rejects.toThrow()
  })
})
