import { randomBytes } from 'crypto'

import { Big, big } from './types'

/** Picks a random integer less than max and greater than 0, using a secure source of randomness. */
export default function pick_random_integer(max: Big): Big {
  const bits = max.bitLength()

  const bytesNeeded = Math.ceil(bits / 8)

  let randomInteger = big(max)

  // Keep searching until max > randomInteger
  while (!max.greaterThan(randomInteger)) {
    // Uses crypto.randomBytes, a cryptographically secure source of randomness
    const bytes = randomBytes(bytesNeeded)
    const buffer = new Uint8Array(bytes)
    const hex_string = buffer.reduce((memo, b) => memo + b.toString(16), '')

    // Add one because we don't accept zero
    randomInteger = big(hex_string, 16).add(Big.ONE)
  }

  return randomInteger
}
