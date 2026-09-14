import { expect, test } from 'bun:test'

import { formatActiveFor, formatLastUpdated } from './lastUpdated'

test('formats the commit calendar date without shifting timezones', () => {
  expect(formatLastUpdated('2026-09-13T23:00:00-07:00')).toBe('September 13, 2026')
})

test('counts days, then months, then years with leftover months', () => {
  expect(formatActiveFor('2026-08-14')).toBe('1 day')
  expect(formatActiveFor('2026-09-13')).toBe('30 days')
  expect(formatActiveFor('2026-09-14')).toBe('1 month')
  expect(formatActiveFor('2027-07-14')).toBe('11 months')
  expect(formatActiveFor('2027-08-14')).toBe('1 year')
  expect(formatActiveFor('2027-11-14')).toBe('1.3 years')
  expect(formatActiveFor('2028-08-14')).toBe('2 years')
})
