import { expect, test } from 'bun:test'

import { secretsMatch } from './secretsMatch'

test('blank tokens should not match', () => {
  expect(secretsMatch(undefined, undefined)).toBe(false)
  expect(secretsMatch(undefined, '')).toBe(false)
  expect(secretsMatch('token', undefined)).toBe(false)
  expect(secretsMatch('token', 'token')).toBe(true)
})
