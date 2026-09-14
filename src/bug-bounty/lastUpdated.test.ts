import { expect, test } from 'bun:test'

import { formatLastUpdated } from './lastUpdated'

test('formats the commit calendar date without shifting timezones', () => {
  expect(formatLastUpdated('2026-09-13T23:00:00-07:00')).toBe('Sunday, September 13, 2026')
})
