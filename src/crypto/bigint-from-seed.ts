import { CURVE } from '@noble/ed25519'

import { bytesToHex } from './bytes-to-hex'
import { sha256 } from './sha256'

/** Deterministically generates a pseudorandom bigint less than `max`, from a seed string. */
export async function bigint_from_seed(seed: string, max = CURVE.l): Promise<bigint> {
  /* This is intended for use in Fiat–Shamir transformations or deterministic PRNGs.
  It uses rejection sampling to avoid mod-bias.

  @param seed - Any string input to bind the randomness to context (e.g., 'proof_type,input1,input2')
  @param max - The upper bound (exclusive) for the output bigint. Defaults to the Ed25519 curve order.
  @returns A bigint uniformly sampled in [0, max) */

  const maxBits = max.toString(2).length
  const bytesNeeded = Math.ceil(maxBits / 8)

  while (true) {
    const hash = await sha256(seed)
    const hex = bytesToHex(new Uint8Array(hash)).slice(0, bytesNeeded * 2)
    const x = BigInt(`0x${hex}`)
    if (x < max) return x

    // Retry deterministically by feeding hash back in
    seed = hex
  }
}
