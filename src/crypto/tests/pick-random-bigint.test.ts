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

const max = 2 ** 15
test(`generates evenly distributed numbers (n=${max})`, () => {
  // Count how many times each number appears
  const counts = new Map<bigint, number>()
  const numSamples = max
  const maxBigInt = BigInt(max)
  const zero = BigInt(0)

  // Generate and count random numbers
  for (let i = 0; i < numSamples; i += 1) {
    const random = pick_random_bigint(maxBigInt)
    expect(random).toBeGreaterThan(zero)
    expect(random).toBeLessThan(maxBigInt)

    const prev = counts.get(random) || 0
    counts.set(random, prev + 1)
  }

  // Analyze the distribution
  const countsArray = Array.from(counts.entries()).map(([number, count]) => ({
    count,
    number,
  }))
  const sortedByFrequency = orderBy(countsArray, 'count', 'desc')

  // // Verify distribution properties
  // - No number should appear significantly more often than others
  const mostFrequentCount = sortedByFrequency[0].count
  expect(mostFrequentCount).toBeLessThan(Math.cbrt(max))

  // - Should have reasonable number of unique values
  const uniqueNumbersCount = countsArray.length
  expect(uniqueNumbersCount).toBeGreaterThan(max * 0.6)
})

// test.todo('Test with dieharder suite https://formulae.brew.sh/formula/dieharder')
