import { shuffle as permute } from 'lodash'

import pick_random_integer from './pick-random-integer'
import { Cipher_Text, Public_Key } from './types'

export function shuffle(pub_key: Public_Key, cipher_texts: Cipher_Text[]): Cipher_Text[] {
  const { generator, modulo, recipient } = pub_key

  // First, we permute the incoming cipher_texts
  // TODO: Replace lodash.shuffle with cryptographically random permutation
  const permuted = permute(cipher_texts)

  // Now we'll re-encrypt each of them...
  const reencrypted = permuted.map((cipher) => {
    const { encrypted, unlock } = cipher

    // Generate a unique random re-encryption factor for each cipher
    const reencryption_factor = pick_random_integer(modulo)

    const encrypted_multiplier = recipient.modPow(reencryption_factor, modulo)
    const new_encrypted = encrypted.multiply(encrypted_multiplier).mod(modulo)

    const unlock_multiplier = generator.modPow(reencryption_factor, modulo)
    const new_unlock = unlock.multiply(unlock_multiplier).mod(modulo)

    return { encrypted: new_encrypted, unlock: new_unlock }
  })

  return reencrypted
}
