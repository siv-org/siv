import { getPublicKey } from '@noble/ed25519'
import { describe, expect, test } from 'bun:test'

import { bytesToHex, hexToBytes } from './bytes-to-hex'
import { generateReplacementKeypair, is64HexChars } from './replacement-key'

describe('generateReplacementKeypair', () => {
  test('returns 32-byte hex keys that match', async () => {
    const { replacement_privkey, replacement_pubkey } = await generateReplacementKeypair()

    expect(is64HexChars(replacement_privkey)).toBe(true)
    expect(is64HexChars(replacement_pubkey)).toBe(true)
    expect(replacement_pubkey).toBe(bytesToHex(await getPublicKey(hexToBytes(replacement_privkey))))
  })

  test('isReplacementPubkey rejects bad values', () => {
    expect(is64HexChars(undefined)).toBe(false)
    expect(is64HexChars('abcd')).toBe(false)
    expect(is64HexChars('g'.repeat(64))).toBe(false)
    expect(is64HexChars('a'.repeat(63))).toBe(false)
  })
})
