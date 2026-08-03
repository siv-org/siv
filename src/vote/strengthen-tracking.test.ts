import { describe, expect, test } from 'bun:test'

import { strengthenTracking } from './strengthen-tracking'

describe('strengthenTracking', () => {
  test('adds into the last 4 digits', () => {
    expect(strengthenTracking('1111-1111-1111', '1234')).toBe('1111-1111-2345')
  })

  test('wraps mod 10000', () => {
    expect(strengthenTracking('1111-1111-9999', '0005')).toBe('1111-1111-0004')
  })

  test('pads short voter digits', () => {
    expect(strengthenTracking('2222-3333-4444', '7')).toBe('2222-3333-4451')
  })

  test('strips non-digits from inputs', () => {
    expect(strengthenTracking('1111-1111-1111', '12-34')).toBe('1111-1111-2345')
  })
})
