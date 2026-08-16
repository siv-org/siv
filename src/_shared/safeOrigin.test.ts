import type { NextApiRequest } from 'next'

import { expect, test } from 'bun:test'

import { safeOrigin } from './safeOrigin'

const req = (host?: string) => ({ headers: { host } } as NextApiRequest)

test('uses siv.org in production, not the per-commit VERCEL_URL', () => {
  expect(safeOrigin(undefined, { VERCEL_ENV: 'production', VERCEL_URL: 'siv-3s8pavoyj-sivteam.vercel.app' })).toBe(
    'https://siv.org',
  )
})

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
  expect(safeOrigin(req('localhost:3001'), { PORT: '3001' })).toBe('http://localhost:3001')
  expect(safeOrigin(req('localhost:3000'), {})).toBe('http://localhost:3000')
  expect(safeOrigin(req('127.0.0.1'), {})).toBe('http://localhost:3000')
})

test('refuses localhost origin when Host is not loopback', () => {
  expect(safeOrigin(req('siv-main-sivteam.vercel.app'), {})).toMatchObject({
    error: expect.stringMatching(/VERCEL_URL is unset/),
  })
})
