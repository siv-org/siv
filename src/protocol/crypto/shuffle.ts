import { shuffle as permute } from 'lodash'

import pick_random_integer from './pick-random-integer'
import { Cipher_Text, Public_Key } from './types'

export default function shuffle(pub_key: Public_Key, cipher_texts: Cipher_Text[]): Cipher_Text[] {
  const { generator, modulo, sealing_target } = pub_key

  // First, we permute the incoming cipher_texts
  // TODO: Replace lodash.shuffle with cryptographically random permutation
  const permuted = permute(cipher_texts)

  // Now we'll re-encrypt each of them...
  const reencrypted = permuted.map((cipher) => {
    const { sealed_data, sealing_factor } = cipher

    // Generate a unique random re-encryption factor for each cipher
    const reencryption_factor = pick_random_integer(modulo)

    const data_multiplier = sealing_target.modPow(reencryption_factor, modulo)
    const new_sealing_data = sealed_data.multiply(data_multiplier).mod(modulo)

    const factor_multiplier = generator.modPow(reencryption_factor, modulo)
    const new_sealing_factor = sealing_factor.multiply(factor_multiplier).mod(modulo)

    return { sealed_data: new_sealing_data, sealing_factor: new_sealing_factor }
  })

  return reencrypted
}
