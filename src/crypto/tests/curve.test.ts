import { expect, test } from 'bun:test'

import { G, pointToString, stringToPoint } from '../curve'

test('Ristretto points can be represented as hex strings, or raw bytes', () => {
  const point = G.multiply(BigInt(12345))
  const hex = point.toHex()
  const bytes = point.toRawBytes()
  expect(hex).toBe('b4c1b3cdef7ba1bd94fa95c7b736622046ef663285813c2293c52c5f4f9fb011')
  expect(bytes.length).toBe(32)
})

test('can embed and extract strings into Ristretto points', () => {
  const message = 'hello world'
  const point = stringToPoint(message)
  const extracted = pointToString(point)
  expect(extracted).toBe(message)
})

test('embedding is non-deterministic', () => {
  const message = 'hello world'
  const point1 = stringToPoint(message).toHex()
  const point2 = stringToPoint(message).toHex()
  //   console.log({ point1, point2 })
  expect(point1).not.toBe(point2)

  // But the first few bytes should match
  const initial = '1668656c6c6f20776f726c64'
  expect(point1.slice(0, initial.length)).toBe(initial)
  expect(point2.slice(0, initial.length)).toBe(initial)
})
