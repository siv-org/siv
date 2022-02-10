import { CURVE } from '@noble/ed25519'

import { bytesToHex } from './bytes-to-hex'
import { mod } from './curve'
import { sha256 } from './sha256'

/**
 * Deterministically generate a pseudorandom bigint less than `max`, from a given `seed` string.
 */
export async function bigint_from_seed(seed: string, max = CURVE.l): Promise<bigint> {
  // This will hold our growing buffer of bytes
  let bytes = new ArrayBuffer(0)

  // How many bytes will we need?
  const bits = max.toString(2).length
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

  // 2. Convert bits into a BigInt
  const hex = `0x${bytesToHex(bytes)}`
  const integer = BigInt(hex)

  // 3. Make sure integer is not greater than max
  const result = mod(integer, max)

  return result
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
