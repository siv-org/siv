import { expect, test } from 'bun:test'
import { mapValues, noop } from 'lodash'

import { CURVE, G, random_bigint, RP, stringToPoint } from '../curve'
import decrypt from '../decrypt'
import encrypt from '../encrypt'
import {
  combine_partials,
  compute_keyshare,
  compute_pub_key,
  evaluate_private_polynomial,
  generate_public_coefficients,
  is_received_share_valid,
  partial_decrypt,
  pick_private_coefficients,
  unlock_message_with_shared_secret,
} from '../threshold-keygen'

// This type will accumulate data throughout this script
type Trustee = {
  broadcast: RP[]
  keyshare?: bigint
  name: string
  private_coefficients: bigint[]
  secrets_from: { [index: string]: bigint }
  verified: { [index: string]: boolean }
}

// // Debug functions
let step_counter = 1
// const { log } = console
const log = noop // console

const log_step = (step: string) => log(`\n${step_counter++}.`, step)

// Convert Bigs to strings
const toString = (trustees: Trustee[]) =>
  trustees.map((p) =>
    mapValues(p, (value, key) => {
      switch (key) {
        case 'keyshare':
          return p.keyshare?.toString()
        case 'private_coefficients':
          return p.private_coefficients?.map((c) => c.toString())
        case 'secrets_from':
          return mapValues(p.secrets_from, (s) => s.toString())
        default:
          return value
      }
    }),
  )

log('Testing the distributed threshold key generation protocol...')

log_step('Admin announces trustees')
const trustees: Trustee[] = 'ABC'
  .split('')
  .map((name) => ({ broadcast: [], name, private_coefficients: [], secrets_from: {}, verified: {} }))
log(trustees)

log_step('Each trustee picks their own private coefficients in Z[l]')
trustees.forEach((_, index) => {
  trustees[index].private_coefficients = pick_private_coefficients(trustees.length)
})
test('can pick random private coefficients', () => {
  toString(trustees).forEach((trustee) => {
    const coefficients = trustee.private_coefficients as bigint[]

    expect(coefficients.length, 'Coefficients are the right length').toBe(trustees.length)
    expect(new Set(coefficients).size, 'Coefficients are distinct').toBe(coefficients.length)
  })
})
log(toString(trustees))

log_step('Each trustee generates broadcast values')
trustees.forEach(({ private_coefficients }, index) => {
  trustees[index].broadcast = generate_public_coefficients(private_coefficients)
})
test('can generate broadcasts proofs', () => {
  trustees.forEach(({ broadcast }) => {
    expect(broadcast.length, 'Broadcast is the right length').toBe(trustees.length)
  })
})
log(toString(trustees))

log_step('Each trustee calculates shares to send to others')
trustees.forEach(({ name, private_coefficients }) => {
  trustees.forEach((_, toIndex) => {
    // Initialize empty object if needed
    if (!trustees[toIndex].secrets_from) {
      trustees[toIndex].secrets_from = {}
    }

    trustees[toIndex].secrets_from[name] = evaluate_private_polynomial(toIndex + 1, private_coefficients)
  })
})
test('can calculate pairwise shares', () => {
  trustees.forEach(({ secrets_from }) => {
    expect(Object.keys(secrets_from).length, 'Shares are the right length').toBe(trustees.length)
  })
})
log(toString(trustees))

log_step('Each trustee can verify their received shares')
trustees.forEach(({ secrets_from }, jIndex) => {
  trustees.forEach(({ broadcast, name }) => {
    // Initialize empty object if needed
    if (!trustees[jIndex].verified) {
      trustees[jIndex].verified = {}
    }

    trustees[jIndex].verified[name] = is_received_share_valid(
      secrets_from[name],
      jIndex + 1,

      broadcast,
    )
  })
})
test('All trustees verify all received shares', () => {
  trustees.forEach(({ name, verified }) => {
    const verifications = Object.keys(verified)

    expect(verifications.length, 'Verifications are the right length').toBe(trustees.length)
    verifications.forEach((verification) =>
      expect(verified[verification], `${name} couldn't verify ${verification}`).toBe(true),
    )
  })
})
// log(toString(trustees))

log_step('Each trustee calculates own keyshare from incoming secrets')
trustees.forEach(({ secrets_from }, index) => {
  trustees[index].keyshare = compute_keyshare(Object.values(secrets_from))
})
test('can calculate own keyshare from incoming secrets', () => {
  trustees.forEach((trustee) => {
    expect(typeof trustee.keyshare, 'Keyshare is bigint').toBe('bigint')
    expect(trustee.keyshare, 'Keyshare is less than l').toBeLessThan(CURVE.l)
  })
})
log(toString(trustees))

log_step('Anyone can calculate the generated pub key from broadcasts')
const first_broadcasts = trustees.map((trustee) => trustee.broadcast[0])
const pub_key = compute_pub_key(first_broadcasts)

// In a real setting no one ever gets the full secret
// but we can test it against pub_key here.
const private_constants = trustees.map((trustee) => trustee.private_coefficients[0])
const full_private_key = compute_keyshare(private_constants)
log({ full_private_key: full_private_key.toString() })
test('Anyone can calculate the generated pub key from broadcasts', () => {
  expect(pub_key.toString(), 'MPC pub key matches expected').toBe(G.multiply(full_private_key).toString())
})
log({ pub_key: pub_key.toString() })

log_step('Given a ciphertext encrypted to pub_key, each trustee can partially decrypt')
const plaintext = 'D'
log({ plaintext })
const encoded = stringToPoint(plaintext)
test('encoded to a point successfully', () => {
  expect(encoded, 'encoded is a point').toBeInstanceOf(RP)
})
log({ encoded })
const encrypted = encrypt(pub_key, random_bigint(), encoded)
log({ encrypted })
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const partials = trustees.map((trustee) => partial_decrypt(encrypted.lock, trustee.keyshare!))
test('Each trustee can partially decrypt', () => {
  partials.forEach((partial) => expect(partial, 'partial is RP').toBeInstanceOf(RP))
})
log({ partials })

log_step('partials can be combined into the shared secret')
const shared_secret = combine_partials(partials)
log({ shared_secret })
const decryptedTogether = unlock_message_with_shared_secret(shared_secret, encrypted.encrypted)
log({ decryptedTogether })

const decryptedAlone = decrypt(full_private_key, encrypted)
log({ decryptedAlone })

// const decoded = decode(decryptedTogether)
// log({ decoded })

test('Decrypted message matches encoded', () => {
  expect(decryptedTogether.toHex(), 'decryptedTogether matches encoded').toBe(encoded.toHex())
  expect(decryptedTogether.toHex(), 'decryptedTogether matches decryptedAlone').toBe(decryptedAlone.toHex())
})
