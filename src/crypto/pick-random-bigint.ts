import { randomBytes } from 'crypto'

/** Picks a random integer less than max and greater than 0, using a secure source of randomness. */
export function pick_random_bigint(max: bigint): bigint {
  const bits = max.toString(2).length

  const bytesNeeded = Math.ceil(bits / 8)

  let rand = max

  // Keep searching until max > rand
  while (!(max > rand)) {
    // Uses crypto.randomBytes, a cryptographically secure source of randomness
    const buffer = new Uint8Array(randomBytes(bytesNeeded))
    const hex = buffer.reduce((memo, b) => memo + b.toString(16), '0x')

    // Add one because we don't accept zero
    rand = BigInt(hex) + BigInt(1)
  }

  return rand
}
