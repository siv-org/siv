import { expect, test } from 'bun:test'

import { safeOrigin } from './safeOrigin'

test('uses VERCEL_URL when the host looks like ours', () => {
  expect(safeOrigin(undefined, { VERCEL_URL: 'siv-git-main-sivteam.vercel.app' })).toBe(
    'https://siv-git-main-sivteam.vercel.app',
  )
  expect(safeOrigin(undefined, { VERCEL_URL: 'https://siv.org/' })).toBe('https://siv.org')
})

test('refuses unexpected VERCEL_URL', () => {
  expect(safeOrigin(undefined, { VERCEL_URL: 'attacker.example.com' })).toMatchObject({
    error: expect.stringMatching(/not localhost/),
  })
  expect(safeOrigin(undefined, { VERCEL_URL: 'preview.siv.org' })).toMatchObject({
    error: expect.stringMatching(/not localhost/),
  })
  expect(safeOrigin(undefined, { VERCEL_URL: 'https://evil.com/api' })).toMatchObject({
    error: expect.stringMatching(/bare hostname/),
  })
})

test('fallback to localhost for local dev', () => {
  expect(safeOrigin('localhost:3001', { PORT: '3001' })).toBe('http://localhost:3001')
  expect(safeOrigin('localhost:3000', {})).toBe('http://localhost:3000')
  expect(safeOrigin('127.0.0.1', {})).toBe('http://localhost:3000')
})

test('refuses localhost origin when Host is not loopback', () => {
  expect(safeOrigin('siv-main-sivteam.vercel.app', {})).toMatchObject({
    error: expect.stringMatching(/VERCEL_URL is unset/),
  })
})
