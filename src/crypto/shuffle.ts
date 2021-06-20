import pick_random_integer from './pick-random-integer'
import { Shuffle_Proof, generate_shuffle_proof } from './shuffle-proof'
import { Cipher_Text, Public_Key, big } from './types'

export async function shuffle(
  pub_key: Public_Key,
  inputs: Cipher_Text[],
): Promise<{ proof: Shuffle_Proof; shuffled: Cipher_Text[] }> {
  const { generator, modulo, recipient } = pub_key

  // First, we need a permutation array and reencryption values
  const permutes = build_permutation_array(inputs.length)

  // Then we'll build the permuted list with these new orders
  const permuted = permute(inputs, permutes)

  // Generate a unique random re-encryption factor for each value
  const reencrypts = permutes.map(() => pick_random_integer(modulo))

  // Now we generate the re-encrypted and shuffled list...
  const shuffled = permuted.map((cipher, index) => {
    const { encrypted, unlock } = cipher
    const reencrypt = reencrypts[permutes[index]]

    const encrypted_multiplier = recipient.modPow(reencrypt, modulo)
    const new_encrypted = encrypted.multiply(encrypted_multiplier).mod(modulo)

    const lock_multiplier = generator.modPow(reencrypt, modulo)
    const new_lock = unlock.multiply(lock_multiplier).mod(modulo)

    return { encrypted: new_encrypted, unlock: new_lock }
  })

  // Finally we generate a ZK proof that it's a valid shuffle
  const proof = await generate_shuffle_proof(
    rename_to_c1_and_2(inputs),
    rename_to_c1_and_2(shuffled),
    reencrypts,
    permutes,
    {
      g: pub_key.generator,
      h: pub_key.recipient,
      p: pub_key.modulo,
      q: pub_key.modulo.subtract(big(1)).divide(big(2)),
    },
  )

  return { proof, shuffled }
}

/** Generates an array of all integers up to `size`, in a random order */
function build_permutation_array(size: number) {
  const array: number[] = []
  const options = [...new Array(size).keys()]
  while (options.length) {
    const i = Math.floor(Math.random() * options.length)
    array.push(options.splice(i, 1)[0])
  }
  return array
}

function permute<T>(input: T[], permutation_array: number[]) {
  return input.map((_, index) => input[permutation_array[index]])
}

export const rename_to_c1_and_2 = (inputs: Cipher_Text[]) =>
  inputs.map(({ encrypted, unlock }) => ({ c1: unlock, c2: encrypted }))
