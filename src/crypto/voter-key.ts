import { getPublicKey, sign, utils, verify } from '@noble/ed25519'
import { CipherStrings } from 'src/crypto/stringify-shuffle'

import { bytesToHex, hexToBytes } from './bytes-to-hex'

/** Canonical bytes the client signs and the server verifies for an esignature submit. */
export function encodeEsignaturePayload({
  auth,
  election_id,
  esignature,
}: {
  auth: string
  election_id: string
  esignature: string
}) {
  return new TextEncoder().encode(JSON.stringify({ auth, election_id, esignature }))
}

/** Canonical bytes the client signs and the server verifies for a vote replace. */
export function encodeReplacementPayload({
  auth,
  election_id,
  encrypted_vote,
}: {
  auth: string
  election_id: string
  encrypted_vote: Record<string, CipherStrings>
}) {
  const sorted = Object.keys(encrypted_vote)
    .sort()
    .reduce((acc, key) => {
      const { encrypted, lock } = encrypted_vote[key]
      acc[key] = { encrypted, lock }
      return acc
    }, {} as Record<string, CipherStrings>)
  return new TextEncoder().encode(JSON.stringify({ auth, election_id, encrypted_vote: sorted }))
}

/** ed25519 keypair for authorizing later updates */
export async function generateVoterKeypair() {
  const privateKey = utils.randomPrivateKey()
  const publicKey = await getPublicKey(privateKey)
  return { voter_privkey: bytesToHex(privateKey), voter_pubkey: bytesToHex(publicKey) }
}

/** 32-byte ed25519 key material as lowercase hex. */
export function is64HexChars(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{64}$/.test(value)
}

/** 64-byte ed25519 signature as lowercase hex. */
export function is128HexChars(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{128}$/.test(value)
}

export async function signReplacement(privkeyHex: string, message: Uint8Array) {
  return bytesToHex(await sign(message, hexToBytes(privkeyHex)))
}

export async function verifyReplacement(pubkeyHex: string, signatureHex: string, message: Uint8Array) {
  return verify(hexToBytes(signatureHex), message, hexToBytes(pubkeyHex))
}
