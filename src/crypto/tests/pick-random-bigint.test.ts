import { expect, test } from 'bun:test'
import { orderBy } from 'lodash'

import { CURVE, random_bigint } from '../curve'
import { pick_random_bigint } from '../pick-random-bigint'

test('Can generate a secret key for voter, using secure source of randomness', () => {
  const secret = random_bigint()

  // Between zero & modulo
  expect(secret).toBeGreaterThan(BigInt(0))
  expect(secret).toBeLessThan(CURVE.l)
})

test('Evenly distributed', () => {
  // Test many cases
  const bits = 10
  const max = 2 ** bits
  // for (let max = 1000; max < 1050; max += 1) {
  const hits: { [index: string]: number } = {}
  for (let i = 0; i < max; i += 1) {
    const random = pick_random_bigint(BigInt(max))

    // Greater than zero
    expect(random).toBeGreaterThan(BigInt(0))

    // Less than max
    expect(random).toBeLessThan(BigInt(max))

    const asString = random.toString()

    hits[asString] = (hits[asString] || 0) + 1
  }

  const uniqueHits = Object.keys(hits)

  // List most common collisions
  const uniqueHitsTuples = uniqueHits.map((h) => ({
    hits: hits[h],
    num: h,
  }))
  const sorted = orderBy(uniqueHitsTuples, 'hits', 'desc')
  // console.log('Top hits:', sorted.slice(0, 5))
  // Expect no random numbers to have collided more than a few times
  expect(sorted[0].hits).toBeLessThan(10)

  // Expect number of unique entries to be within 40% of max
  const numberUniques = uniqueHits.length
  const diff = (max - numberUniques) / max
  // const diffPercent = Math.floor(diff * 1000) / 10
  // console.log({
  //   bits,
  //   diffPercent,
  //   max,
  //   numberUniques,
  // })
  expect(diff).toBeLessThan(0.4)
  // }
})

// test.todo('Test with dieharder suite https://formulae.brew.sh/formula/dieharder')
