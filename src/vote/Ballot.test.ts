import { expect, test } from 'bun:test'

import { max_string_length, optionPlaintextToken } from './Ballot'

test('optionPlaintextToken truncates long ASCII values to max_string_length', () => {
  const token = optionPlaintextToken('ignored name', '12345678901234567890')
  expect(token).toBe('123456789012345')
  expect(new TextEncoder().encode(token).length).toBe(max_string_length)
})

test('optionPlaintextToken should keep UTF-8 byte length within max_string_length', () => {
  const token = optionPlaintextToken('ignored name', 'é'.repeat(15))
  expect(new TextEncoder().encode(token).length).toBeLessThanOrEqual(max_string_length)
})
