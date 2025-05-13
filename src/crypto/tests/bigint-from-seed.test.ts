import { expect, test } from 'bun:test'
import { range } from 'lodash'

import { bigint_from_seed } from '../bigint-from-seed'
import { CURVE, G } from '../curve'

test('Deterministically generate a pseudorandom integer less than `max`, from a given `seed` string.', async () => {
  // Make multiple versions
  const bigints = await Promise.all(range(5).map(() => bigint_from_seed('foobar')))

  // Between zero & max (zero inclusive)
  expect(bigints[0]).toBeGreaterThanOrEqual(BigInt(0))
  expect(bigints[0]).toBeLessThan(CURVE.l)

  // Determinism: Test all are the same value
  bigints.forEach((b) => {
    expect(b).toBe(bigints[0])
  })
})

test("RPs implicitly cast .toHex() when .join()'d", () => {
  // If this breaks, Fiat-Shamir PRNGs could lose soundness, letting in invalid proofs.
  // So we explicitly test for it, to protect against future library updates or similar.
  const point = G.multiply(BigInt(12345))

  const explicitHex = point.toHex()
  const joined = [point, point].join(',')

  expect(joined).toBe(`${explicitHex},${explicitHex}`)
})

test('RP.toString() is stable and canonical', () => {
  // This test warns against changes in RP.toString(),
  // which would invalidate existing Fiat–Shamir proofs.
  const point = G.multiply(BigInt(12345))
  const expected = 'b4c1b3cdef7ba1bd94fa95c7b736622046ef663285813c2293c52c5f4f9fb011'
  expect(point.toString()).toBe(expected)
})
