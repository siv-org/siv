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
    expect(customized.previous_submissions).toHaveLength(1)
    expect(decryptSelection(customized, 'mayor')).toBe('1111-1111-2345:Alice')
    expect(customized.encrypted.mayor).not.toEqual(voted.encrypted.mayor)
  })

  test('customizing archives prior crypto in previous_submissions', () => {
    const firstVerif = '1111-1111-1111'
    const first = reducer({ ...blank(), public_key: pub, tracking: firstVerif }, { mayor: 'Alice' })

    const secondVerif = '1111-1111-2345'
    const second = reducer(first, { tracking: secondVerif })

    expect(second.previous_submissions).toHaveLength(1)
    const [archived] = second.previous_submissions || []
    expect(archived).toMatchObject({
      encoded: first.encoded,
      encrypted: first.encrypted,
      plaintext: first.plaintext,
      randomizer: first.randomizer,
      tracking: firstVerif,
    })
    expect(archived.replaced_at).toBeTruthy()
    expect(archived).not.toHaveProperty('public_key')
    expect(archived).not.toHaveProperty('previous_submissions')
    expect(second.randomizer.mayor).not.toBe(first.randomizer.mayor)

    // Third strengthen stacks; first archive stays intact
    const third = reducer(second, { tracking: '1111-1111-9999' })
    expect(third.previous_submissions).toHaveLength(2)
    const [orig, next] = third.previous_submissions || []
    expect(orig).toEqual(archived)
    expect(next).toMatchObject({
      encrypted: second.encrypted,
      randomizer: second.randomizer,
      tracking: secondVerif,
    })
    expect(next.replaced_at).toBeTruthy()
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
    expect(again.previous_submissions).toBeUndefined()
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
