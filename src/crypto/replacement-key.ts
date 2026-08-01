import { getPublicKey, utils } from '@noble/ed25519'

import { bytesToHex } from './bytes-to-hex'

/** ed25519 keypair for authorizing later vote replacements (strengthen / selection update). */
export async function generateReplacementKeypair() {
  const privateKey = utils.randomPrivateKey()
  const publicKey = await getPublicKey(privateKey)
  return {
    replacement_privkey: bytesToHex(privateKey),
    replacement_pubkey: bytesToHex(publicKey),
  }
}

/** 32-byte ed25519 public key as lowercase hex. */
export function is64HexChars(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{64}$/.test(value)
}
