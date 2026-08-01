import { describe, expect, test } from 'bun:test'
import { pointToString, RP } from 'src/crypto/curve'
import { decrypt } from 'src/crypto/decrypt'
import { generate_key_pair } from 'src/crypto/generate-key-pair'

import { reducer, State } from './vote-state'

const { decryption_key, public_key } = generate_key_pair()
const pub = public_key.toHex()

const blank = (): State => ({ encoded: {}, encrypted: {}, plaintext: {}, randomizer: {} })

function decryptSelection(state: State, key: string) {
  const cipher = state.encrypted[key]
  return pointToString(
    decrypt(decryption_key, { encrypted: RP.fromHex(cipher.encrypted), lock: RP.fromHex(cipher.lock) }),
  )
}

describe('vote-state reducer', () => {
  test('encrypts selections as tracking:value and generates a tracking number', () => {
    const state = reducer({ ...blank(), public_key: pub }, { mayor: 'Alice' })

    expect(state.tracking).toMatch(/^\d{4}-\d{4}-\d{4}$/)
    expect(state.plaintext.mayor).toBe('Alice')
    expect(decryptSelection(state, 'mayor')).toBe(`${state.tracking}:Alice`)
    expect(state.encoded.mayor).toBeTruthy()
    expect(state.randomizer.mayor).toBeTruthy()
  })

  test('customizing tracking re-encrypts under the new number without changing selections', () => {
    const voted = reducer({ ...blank(), public_key: pub, tracking: '1111-1111-1111' }, { mayor: 'Alice' })
    const customized = reducer(voted, { tracking: '1111-1111-2345' })

    expect(customized.tracking).toBe('1111-1111-2345')
    expect(customized.plaintext.mayor).toBe('Alice')
    expect(customized.tracking_customized_at).toBeTruthy()
    expect(decryptSelection(customized, 'mayor')).toBe('1111-1111-2345:Alice')
    expect(customized.encrypted.mayor).not.toEqual(voted.encrypted.mayor)
  })

  test('tracking customize is a no-op without plaintext or public key', () => {
    expect(reducer({ ...blank(), public_key: pub }, { tracking: '1111-1111-2345' })).toEqual({
      ...blank(),
      public_key: pub,
    })
    expect(reducer({ ...blank(), plaintext: { mayor: 'Alice' } }, { tracking: '1111-1111-2345' })).toEqual({
      ...blank(),
      plaintext: { mayor: 'Alice' },
    })
  })

  test('same tracking does not take the customize path', () => {
    const voted = reducer({ ...blank(), public_key: pub, tracking: '1111-1111-1111' }, { mayor: 'Alice' })
    const again = reducer(voted, { tracking: '1111-1111-1111' })
    expect(again.tracking_customized_at).toBeUndefined()
    expect(decryptSelection(again, 'mayor')).toBe('1111-1111-1111:Alice')
  })

  test('clearing a selection removes its encrypted fields', () => {
    const voted = reducer({ ...blank(), public_key: pub, tracking: '1111-1111-1111' }, { mayor: 'Alice' })
    const cleared = reducer(voted, { mayor: '' })

    expect(cleared.plaintext.mayor).toBeUndefined()
    expect(cleared.encrypted.mayor).toBeUndefined()
    expect(cleared.encoded.mayor).toBeUndefined()
    expect(cleared.randomizer.mayor).toBeUndefined()
  })

  test('submitted_at updates without touching encryption', () => {
    const voted = reducer({ ...blank(), public_key: pub, tracking: '1111-1111-1111' }, { mayor: 'Alice' })
    const submitted = reducer(voted, { submitted_at: '2026-01-01' })

    expect(String(submitted.submitted_at)).toBe('2026-01-01')
    expect(submitted.encrypted).toEqual(voted.encrypted)
  })
})
