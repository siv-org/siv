// import { Crypto } from '@peculiar/webcrypto'

import { Big, big } from './types'

// const crypto = new Crypto()

/**
 * Deterministically generate a pseudorandom integer less than `max`, from a given `seed` string.
 */
export async function integer_from_seed(seed: string, max: Big): Promise<Big> {
  // This will hold our growing buffer of bytes
  let bytes = new ArrayBuffer(0)

  // How many bytes will we need?
  const bits = max.bitLength()
  const bytesNeeded = Math.ceil(bits / 8)

  // Because we're going to mod the result, we want to create significantly more bytes
  // than necessary, so that the overlap bias becomes insignificant
  const antibias_amount = 10

  // 1. Get enough bits
  while (bytes.byteLength < bytesNeeded + antibias_amount) {
    // eslint-disable-next-line no-await-in-loop
    const hash = await sha256(seed)
    // eslint-disable-next-line no-param-reassign
    seed = [...new Uint8Array(hash)].join(',')
    bytes = appendBuffer(bytes, hash)
  }

  // 2. Convert bits into a BigInteger
  const integer = big([...new Uint8Array(bytes)])

  // 3. Make sure integer is not greater than max
  const result = integer.mod(max)

  return result
}

// Example from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#Basic_example
async function sha256(message: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return hash
}

/**
 * Creates a new Uint8Array based on two different ArrayBuffers
 *
 * @param buffer1 The first buffer.
 * @param buffer2 The second buffer.
 * @return The new ArrayBuffer created out of the two.
 *
 * from: https://gist.github.com/72lions/4528834
 */
function appendBuffer(buffer1: ArrayBuffer, buffer2: ArrayBuffer) {
  const temporary = new Uint8Array(buffer1.byteLength + buffer2.byteLength)
  temporary.set(new Uint8Array(buffer1), 0)
  temporary.set(new Uint8Array(buffer2), buffer1.byteLength)
  return temporary.buffer
}
