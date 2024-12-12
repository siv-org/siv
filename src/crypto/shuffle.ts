import { RP, random_bigint } from './curve'
import { Shuffle_Proof, generate_shuffle_proof } from './shuffle-proof'

export type Cipher = { encrypted: RP; lock: RP }

export type Public_Key = RP
const G = RP.BASE

export async function shuffleWithProof(
  pub_key: Public_Key,
  inputs: Cipher[],
): Promise<{ proof: Shuffle_Proof; shuffled: Cipher[] }> {
  const { proof, shuffled } = await shuffle(pub_key, inputs)
  return { proof, shuffled }
}

export async function shuffleWithoutProof(pub_key: Public_Key, inputs: Cipher[]): Promise<{ shuffled: Cipher[] }> {
  const { shuffled } = await shuffle(pub_key, inputs, { skip_proof: true })
  return { shuffled }
}

/** Private function that does the shuffling, with option to skip generating the costly proof.
 * We export non-overloaded functions `shuffleWithProof()` and `shuffleWithoutProof()`, so types can be more cleanly inferred.
 */
async function shuffle(pub_key: Public_Key, inputs: Cipher[]): Promise<{ proof: Shuffle_Proof; shuffled: Cipher[] }>
async function shuffle(
  pub_key: Public_Key,
  inputs: Cipher[],
  options: { skip_proof: true },
): Promise<{ shuffled: Cipher[] }>
async function shuffle(
  pub_key: Public_Key,
  inputs: Cipher[],
  options: { skip_proof?: boolean } = {},
): Promise<{ proof?: Shuffle_Proof; shuffled: Cipher[] }> {
  // First, we need a permutation array and reencryption values
  const permutes = build_permutation_array(inputs.length)

  // Then we'll build the permuted list with these new orders
  const permuted = permute(inputs, permutes)

  // Generate a unique random re-encryption factor for each value
  const reencrypts = permutes.map(random_bigint)

  // Now we generate the re-encrypted and shuffled list...
  const shuffled = permuted.map((cipher, index) => {
    const { encrypted, lock } = cipher
    const reencrypt = reencrypts[permutes[index]]

    const encrypted_shift = pub_key.multiply(reencrypt)
    const new_encrypted = encrypted.add(encrypted_shift)

    const lock_shift = G.multiply(reencrypt)
    const new_lock = lock.add(lock_shift)

    return { encrypted: new_encrypted, lock: new_lock }
  })

  // Can skip generating costly proof
  if (options?.skip_proof) return { shuffled }

  // Finally we generate a ZK proof that it's a valid shuffle
  const proof = await generate_shuffle_proof(
    rename_to_c1_and_2(inputs),
    rename_to_c1_and_2(shuffled),
    reencrypts,
    permutes,
    pub_key,
  )

  return { proof, shuffled }
}

/** Generates an array of all integers up to `size`, in a random order */
export function build_permutation_array(size: number) {
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

export const rename_to_c1_and_2 = (inputs: Cipher[]) =>
  inputs.map(({ encrypted, lock }) => ({ c1: lock, c2: encrypted }))

/** This permutes the order, but doesn't re-encrypt nor generates ZK proofs. It's used to speed up Unlocking votes when there are no other Privacy Protectors. */
export const fastShuffle = (inputs: Cipher[]): Cipher[] => permute(inputs, build_permutation_array(inputs.length))
