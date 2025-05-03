// Based on https://www.sci-hub.tw/10.1007/s00145-006-0347-3
// "Secure Distributed Key Generation for Discrete-Log Based Cryptosystems"
// by Rosario Gennaro, Stanislaw Jarecki, Hugo Krawczyk and Tal Rabin
// Section 3 Figure 1

import { CURVE } from '@noble/ed25519'
import { range } from 'src/utils'

import { AsyncReturnType } from './async-return-type'
import { bigint_from_seed } from './bigint-from-seed'
import { G, mod, random_bigint, RP, sum_bigints, sum_points } from './curve'
import { moduloLambda } from './lagrange'

/**
   Each party Pᵢ (as a dealer) chooses a random polynomial fᵢ(z) over Z[q] of degree t-1:
   fᵢ(z) = a[i,1] + a[i,2]z + ··· + a[i,t]z^t-1
 */
export const pick_private_coefficients = (threshold: number) => range(threshold).map(random_bigint)

/** Pᵢ broadcasts A[i,k] = g^(a[i,k]) mod p for k = 0,...,t. */
export const generate_public_coefficients = (private_coefficients: bigint[]): RP[] =>
  private_coefficients.map((a) => G.multiply(a))

/**
Each Pᵢ computes the shares s[i,j] = fᵢ(j) mod q for j = 1,...,n
and sends s[i,j] secretly to party Pⱼ */
export const evaluate_private_polynomial = (j: number, private_coefficients: bigint[]): bigint => {
  // Convert terms to polynomial
  const terms = private_coefficients.map((a, degree) => mod(a * BigInt(j ** degree)))

  // Sum up all the terms
  return sum_bigints(terms)
}

/** Each Pⱼ verifies the shares he received from the other parties by checking for i = 1,...,n:

 g^(s[i,j]) = Product( k=0, t-1 ){ (A[i,k]) ^j ^k mod p }

 */
export const is_received_share_valid = (
  received_secret: bigint,
  receivers_index_j: number,
  Broadcasts: RP[],
): boolean => {
  // Left side of equality check
  const g_to_share = G.multiply(received_secret)

  // Right side of equality check
  const multiplicands = Broadcasts.map((B, k) => B.multiply(receivers_index_j ** k))

  const product = sum_points(multiplicands)

  const passes = g_to_share.equals(product)

  if (!passes) {
    console.log(`received share #${receivers_index_j} ${received_secret} invalid
    g_to_share: ${g_to_share}
    product: ${product}
    `)
  }

  return passes
}

/** compute key share:
    sⱼ = sum[i=1, n]{ s[ᵢ,j] }
*/
export const compute_keyshare = sum_bigints

/** and compute public threshold key:
    y = product[k=1, n]{ A[k,0] }
*/
export const compute_pub_key = sum_points

// -

// -

// To decrypt a given ciphertext (c[1],c[2]).

/* Let Q be any subgroup of size t,
    for example {P[1],…,P[t]}.
*/

/** Each party Pⱼ of Q broadcast
    dⱼ = c[1]^(sⱼ)
similar to DKG scheme */
export const partial_decrypt = (unlock: RP, private_key_share: bigint) => unlock.multiply(private_key_share)

/** then compute:
    d = d[1]^λ[1] ... d[t]^λ[t]
      = c[1]^(s[1]λ[1]) ... c[1]^(s[t]λ[t])
      = c[1]^a
*/
export const combine_partials = (partial_decrypts: RP[]) => {
  const indices = range(1, partial_decrypts.length + 1)

  const indices_as_bigs = indices.map((index) => [BigInt(index)])
  const lambdas = indices_as_bigs.map((_, index) => moduloLambda(index, indices_as_bigs, CURVE.l))

  const partials_to_lambdas = partial_decrypts.map((partial, index) => partial.multiply(lambdas[index]))
  return sum_points(partials_to_lambdas)
}

/** Each keyshare holder has their own private key...
 *  In order to validate Partial Decryption Proofs,
 *  the verifier requires that trustee's "g_to_trustees_keyshare" value.
 *
 *  This can be calculated publicly by anyone,
 *  just via the Public Broadcasts Commitments.
 *
 *  e.g. for "received_shares" rs_1, rs_2, rs_3
 *  their private keyshare is the sum: ks = rs_1 + rs_2 + rs_3.
 *
 *  Anyone can calculate each g^rs_1, g^rs_2, g^rs_3
 *  as Product( c from 0 to t-1 ){ Ac ^receivers_index ^c % p }
 *  as in is_received_share_valid() func.
 *
 *  Thus anyone can calculate:
 *  g^ks = g ^ (rs_1 + rs_2 + rs_3) = g^rs_1 * g^rs_2 * g^rs_3
 */
export function compute_g_to_keyshare(receivers_index_j: number, Broadcasts: RP[][]) {
  const g_to_rss = Broadcasts.map((Broadcast) => {
    const multiplicands = Broadcast.map((B, k) => B.multiply(receivers_index_j ** k))

    return sum_points(multiplicands)
  })

  return sum_points(g_to_rss)
}

/** Creates non-interactive Zero Knowledge proof of a valid partial decryption
 *  by proving these two logs are equivalent:
 *
 *  log(g^trustees_secret)/log(g) = log(partial_decryption)/log(unlock_factor)
 *
 *  which are both equal to trustees_secret
 *
 *  @param cipher_lock c[0] of the encrypted ciphertext (g ^ randomizer)
 *  @param trustees_secret
 *
 *  Based on Chaum-Pedersen ZK Proof of Discrete Logs
 *
 */
export async function generate_partial_decryption_proof(cipher_lock: RP, trustees_secret: bigint) {
  // Prover picks a secret random integer less than q
  const secret_r = random_bigint()

  const g_to_trustees_keyshare = G.multiply(trustees_secret)

  // Calculates Verifier's deterministic random number (Fiat-Shamir technique):
  const public_r = await bigint_from_seed(`${cipher_lock} ${g_to_trustees_keyshare}`)

  // Prover creates and sends:
  const O = mod(secret_r + public_r * trustees_secret)

  // Prover also shares commitment of their secret randomizer choice
  const R = G.multiply(secret_r)
  const LR = cipher_lock.multiply(secret_r)

  return { LR, O, R }
}

/** Verifies a non-interactive Zero Knowledge proof of a valid partial decryption
 *  by checking these two logs are equivalent:
 *
 *  log(g^trustees_secret)/log(g) = log(partial_decryption)/log(unlock_factor)
 *
 *  which are both equal to trustees_secret
 *
 *  @param cipher_lock c[0] of the encrypted ciphertext (g ^ randomizer)
 *  @param g_to_trustees_keyshare - See `compute_g_to_keyshare()` func above
 *  @param partial_decryption - partial decryption to prove is valid
 *
 *  Based on Chaum-Pedersen ZK Proof of Discrete Logs
 *
 */
export async function verify_partial_decryption_proof(
  cipher_lock: RP,
  g_to_trustees_keyshare: RP,
  partial_decryption: RP,
  { LR, O, R }: AsyncReturnType<typeof generate_partial_decryption_proof>,
): Promise<boolean> {
  // Recalculate deterministic verifier nonce
  const public_r = await bigint_from_seed(`${cipher_lock} ${g_to_trustees_keyshare}`)

  // Verifier checks:
  // g ^ O
  const left_side_1 = G.multiply(O)
  //   == R * (g ^ trustee_secret ^ public_r)
  const right_side_1 = R.add(g_to_trustees_keyshare.multiply(public_r))
  const check1 = left_side_1.equals(right_side_1)

  // And Verifier checks:
  // cipher_lock ^ O
  const left_side_2 = cipher_lock.multiply(O)
  //   == LR * (partial_decryption ^ public_r)
  const right_side_2 = LR.add(partial_decryption.multiply(public_r))
  const check2 = left_side_2.equals(right_side_2)

  return check1 && check2
}

/** Thereafter, compute
    m = c[2] / d
*/
export const unlock_message_with_shared_secret = (shared_secret: RP, sealed_data: RP): RP => {
  const decrypted = sealed_data.subtract(shared_secret)

  return decrypted
}
