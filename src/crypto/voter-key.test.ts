import { getPublicKey } from '@noble/ed25519'
import { describe, expect, test } from 'bun:test'

import { bytesToHex, hexToBytes } from './bytes-to-hex'
import {
  encodeReplacementPayload,
  generateVoterKeypair,
  is64HexChars,
  is128HexChars,
  signReplacement,
  verifyReplacement,
} from './voter-key'

describe('generateVoterKeypair', () => {
  test('returns 32-byte hex keys that match', async () => {
    const { voter_privkey, voter_pubkey } = await generateVoterKeypair()

    expect(is64HexChars(voter_privkey)).toBe(true)
    expect(is64HexChars(voter_pubkey)).toBe(true)
    expect(voter_pubkey).toBe(bytesToHex(await getPublicKey(hexToBytes(voter_privkey))))
  })

  test('is64HexChars rejects bad values', () => {
    expect(is64HexChars(undefined)).toBe(false)
    expect(is64HexChars('abcd')).toBe(false)
    expect(is64HexChars('g'.repeat(64))).toBe(false)
    expect(is64HexChars('a'.repeat(63))).toBe(false)
  })
})

describe('signReplacement / verifyReplacement', async () => {
  const { voter_privkey, voter_pubkey } = await generateVoterKeypair()
  const encrypted_vote = { mayor: { encrypted: 'aa', lock: 'bb' }, prop: { encrypted: 'cc', lock: 'dd' } }
  const message = encodeReplacementPayload({ auth: 'abcd123456', election_id: 'e1', encrypted_vote })
  const signature = await signReplacement(voter_privkey, message)

  test('valid signature verifies', async () => {
    expect(is128HexChars(signature)).toBe(true)
    expect(await verifyReplacement(voter_pubkey, signature, message)).toBe(true)
  })

  test('encodeReplacementPayload produces canonical bytes, no matter object order', () => {
    // Same fields, opposite key insertion order
    const shuffledVote = {
      prop: { encrypted: 'cc', lock: 'dd' },
      // eslint-disable-next-line perfectionist/sort-objects -- intentional
      mayor: { encrypted: 'aa', lock: 'bb' },
    }

    // Confirm key-order is different
    expect(Object.keys(shuffledVote)).not.toEqual(Object.keys(encrypted_vote))

    // Encoding should still match
    const shuffled = encodeReplacementPayload({
      auth: 'abcd123456',
      election_id: 'e1',
      encrypted_vote: shuffledVote,
    })
    expect([...message]).toEqual([...shuffled])
  })

  test('tampered encrypted_vote does not verify', async () => {
    const tampered = encodeReplacementPayload({
      auth: 'abcd123456',
      election_id: 'e1',
      encrypted_vote: { ...encrypted_vote, mayor: { encrypted: 'zz', lock: 'bb' } },
    })
    expect(await verifyReplacement(voter_pubkey, signature, tampered)).toBe(false)
  })
})
