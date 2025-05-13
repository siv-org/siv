import { expect, test } from 'bun:test'
import { orderBy } from 'lodash'

import { CURVE, random_bigint } from '../curve'
import { pick_random_bigint } from '../pick-random-bigint'

test('generates a number between 0 and max', () => {
  const max = BigInt(100)
  const random = pick_random_bigint(max)

  expect(random).toBeGreaterThan(BigInt(0))
  expect(random).toBeLessThan(max)
})

test('generates a valid secret key for voter using secure source of randomness', () => {
  const secret = random_bigint()

  expect(secret).toBeGreaterThan(BigInt(0))
  expect(secret).toBeLessThan(CURVE.l)
})

test('handles edge cases correctly', () => {
  // Test with small max
  const smallMax = BigInt(2)
  const smallRandom = pick_random_bigint(smallMax)
  expect(smallRandom).toBe(BigInt(1))

  // Test with large max
  const largeMax = BigInt(2) ** BigInt(256)
  const largeRandom = pick_random_bigint(largeMax)
  expect(largeRandom).toBeGreaterThan(BigInt(0))
  expect(largeRandom).toBeLessThan(largeMax)
})

const max = 2 ** 16
test(`generates evenly distributed numbers (n=${max})`, () => {
  const hits: { [index: string]: number } = {}
  const numSamples = max

  // Generate samples
  for (let i = 0; i < numSamples; i += 1) {
    const random = pick_random_bigint(BigInt(max))
    expect(random).toBeGreaterThan(BigInt(0))
    expect(random).toBeLessThan(BigInt(max))

    const asString = random.toString()
    hits[asString] = (hits[asString] || 0) + 1
  }

  // Analyze distribution
  const uniqueHits = Object.keys(hits)
  const uniqueHitsTuples = uniqueHits.map((h) => ({
    hits: hits[h],
    num: h,
  }))
  const sorted = orderBy(uniqueHitsTuples, 'hits', 'desc')

  // Test distribution properties
  const maxHits = sorted[0].hits
  const numberUniques = uniqueHits.length
  const diff = (max - numberUniques) / max

  // No number should appear significantly more often than others
  expect(maxHits).toBeLessThan(Math.cbrt(max))

  // Should have good coverage of the range
  expect(diff).toBeLessThan(0.4)

  // Should have reasonable number of unique values
  expect(numberUniques).toBeGreaterThan(max * 0.6)
})

// test.todo('Test with dieharder suite https://formulae.brew.sh/formula/dieharder')
