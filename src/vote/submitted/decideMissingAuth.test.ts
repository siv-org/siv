import { describe, expect, test } from 'bun:test'

import { decideMissingAuth, LINK_AUTH_RECOVERY_ELECTIONS } from './decideMissingAuth'

const CCN = [...LINK_AUTH_RECOVERY_ELECTIONS][0]
const OTHER = '0000000000000'
const encrypted = { vote: { encrypted: 'aa', lock: 'bb' } }

describe('decideMissingAuth cohorts', () => {
  test('e — non-whitelisted election: skip, never fetch', () => {
    expect(
      decideMissingAuth({
        auth: 'link',
        election_id: OTHER,
        encrypted,
        knownLinkAuth: null,
      }),
    ).toEqual({ action: 'skip' })
  })

  test('already has auth_added_at / not link: skip', () => {
    expect(
      decideMissingAuth({
        auth: 'link',
        auth_added_at: '2026-07-14T00:00:00.000Z',
        election_id: CCN,
        encrypted,
        knownLinkAuth: null,
      }),
    ).toEqual({ action: 'skip' })
    expect(
      decideMissingAuth({
        auth: 'abc123token',
        election_id: CCN,
        encrypted,
        knownLinkAuth: null,
      }),
    ).toEqual({ action: 'skip' })
  })

  test('a — completed before writes: ciphertext fetch, then mark_complete', () => {
    expect(
      decideMissingAuth({
        auth: 'link',
        election_id: CCN,
        encrypted,
        knownLinkAuth: null,
      }),
    ).toEqual({ action: 'fetch', body: { encrypted_vote: encrypted } })

    expect(
      decideMissingAuth({
        auth: 'link',
        election_id: CCN,
        encrypted,
        knownLinkAuth: null,
        lookup: { ok: true, result: { link_auth: 'aabbccddee', needs_auth: false } },
      }),
    ).toEqual({ action: 'mark_complete', link_auth: 'aabbccddee' })
  })

  test('b — incomplete before writes: ciphertext fetch, then cta', () => {
    expect(
      decideMissingAuth({
        auth: 'link',
        election_id: CCN,
        encrypted,
        knownLinkAuth: null,
        lookup: { ok: true, result: { link_auth: 'bbbbbbbbbb', needs_auth: true } },
      }),
    ).toEqual({ action: 'cta', link_auth: 'bbbbbbbbbb' })
  })

  test('c/d — incomplete with stored link_auth: link_auth fetch, then cta', () => {
    expect(
      decideMissingAuth({
        auth: 'link',
        election_id: CCN,
        encrypted,
        knownLinkAuth: 'cccccccccc',
      }),
    ).toEqual({ action: 'fetch', body: { link_auth: 'cccccccccc' } })

    expect(
      decideMissingAuth({
        auth: 'link',
        election_id: CCN,
        encrypted,
        knownLinkAuth: 'cccccccccc',
        lookup: { ok: true, result: { link_auth: 'cccccccccc', needs_auth: true } },
      }),
    ).toEqual({ action: 'cta', link_auth: 'cccccccccc' })
  })

  test('ciphertext recovery http/network failure: error; link_auth failure: silent skip', () => {
    expect(
      decideMissingAuth({
        auth: 'link',
        election_id: CCN,
        encrypted,
        knownLinkAuth: null,
        lookup: { kind: 'http', ok: false },
      }),
    ).toEqual({
      action: 'error',
      message: 'Error recovering your registration link. Please contact help@siv.org for assistance.',
    })

    expect(
      decideMissingAuth({
        auth: 'link',
        election_id: CCN,
        encrypted,
        knownLinkAuth: null,
        lookup: { kind: 'network', ok: false },
      }),
    ).toEqual({
      action: 'error',
      message: 'Error getting your registration info. Please contact help@siv.org for assistance.',
    })

    expect(
      decideMissingAuth({
        auth: 'link',
        election_id: CCN,
        encrypted,
        knownLinkAuth: 'cccccccccc',
        lookup: { kind: 'http', ok: false },
      }),
    ).toEqual({ action: 'skip' })
  })
})
