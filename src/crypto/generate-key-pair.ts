import { G, RP, random_bigint } from './curve'

export function generate_key_pair(): { decryption_key: bigint; public_key: RP } {
  const decryption_key = random_bigint()

  return { decryption_key, public_key: G.multiply(decryption_key) }
}
