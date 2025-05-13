import { expect, test } from 'bun:test'
import { range } from 'lodash'

import { bigint_from_seed } from '../bigint-from-seed'
import { CURVE } from '../curve'

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
