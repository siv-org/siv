// Based on https://www.sci-hub.tw/10.1007/s00145-006-0347-3
// "Secure Distributed Key Generation for Discrete-Log Based Cryptosystems"
// by Rosario Gennaro, Stanislaw Jarecki, Hugo Krawczyk and Tal Rabin
// Section 3 Figure 1

import { range } from 'lodash'

import { AsyncReturnType } from './async-return-type'
import { integer_from_seed } from './integer-from-seed'
import { moduloLambda } from './lagrange'
import pickRandomInteger from './pick-random-integer'
import { Big, big } from './types'

export type Parameters = { g: Big; p: Big; q: Big }

/** Sum up an array of Bigs */
export const sum_bigs = (bigs: Big[], modulo: Big): Big => bigs.reduce((memo, term) => memo.add(term).mod(modulo))

/** Multiply up an array of Bigs */
export const product_bigs = (bigs: Big[], modulo: Big): Big =>
  bigs.reduce((memo, term) => memo.multiply(term).mod(modulo))

/**
   Each party Pᵢ (as a dealer) chooses a random polynomial fᵢ(z) over Z[q] of degree t-1:
   fᵢ(z) = a[i,1] + a[i,2]z + ··· + a[i,t]z^t-1
 */
export const pick_private_coefficients = (threshold: number, { q }: Parameters) =>
  range(threshold).map(() => pickRandomInteger(q))

/** Pᵢ broadcasts A[i,k] = g^(a[i,k]) mod p for k = 0,...,t. */
export const generate_public_coefficients = (private_coefficients: Big[], { g, p }: Parameters): string[] =>
  private_coefficients.map((a) => g.modPow(a, p).toString())

/**
Each Pᵢ computes the shares s[i,j] = fᵢ(j) mod q for j = 1,...,n
and sends s[i,j] secretly to party Pⱼ */
export const evaluate_private_polynomial = (j: number, private_coefficients: Big[], { q }: Parameters): Big => {
  // Convert terms to polynomial
  const terms = private_coefficients.map((a, degree) => a.multiply(big(j).pow(degree)).mod(q))

  // Sum up all the terms
  return sum_bigs(terms, q)
}

/** Each Pⱼ verifies the shares he received from the other parties by checking for i = 1,...,n:

 g^(s[i,j]) = Product( k=0, t-1 ){ (A[i,k]) ^j ^k mod p }

 */
export const is_received_share_valid = (
  received_secret: Big,
  receivers_index_j: number,
  broadcast: string[],
  { g, p }: Parameters,
): boolean => {
  // Left side of equality check
  const g_to_share = g.modPow(received_secret, p)

  // Right side of equality check
  const multiplicands = broadcast.map((b, k) => big(b).modPow(big(receivers_index_j).pow(k), p))

  const product = product_bigs(multiplicands, p)

  const passes = g_to_share.equals(product)

  if (!passes) {
    // eslint-disable-next-line no-console
    console.log(`received share #${receivers_index_j} ${received_secret.toString()} invalid
    g_to_share: ${g_to_share.toString()}
    product: ${product.toString()}
    `)
  }

  return passes
}

/** compute key share:
    sⱼ = sum[i=1, n]{ s[ᵢ,j] }
*/
export const compute_keyshare = sum_bigs

/** and compute public threshold key:
    y = product[k=1, n]{ A[k,0] }
*/
export const compute_pub_key = product_bigs

// -

// -

// To decrypt a given ciphertext (c[1],c[2]).

/* Let Q be any subgroup of size t,
    for example {P[1],…,P[t]}.
*/

/** Each party Pⱼ of Q broadcast
    dⱼ = c[1]^(sⱼ)
similar to DKG scheme */
export const partial_decrypt = (lock: Big, private_key_share: Big, { p }: Parameters) =>
  lock.modPow(private_key_share, p)

/** then compute:
    d = d[1]^λ[1] ... d[t]^λ[t]
      = c[1]^(s[1]λ[1]) ... c[1]^(s[t]λ[t])
      = c[1]^a
*/
export const combine_partials = (partial_decrypts: Big[], { p, q }: Parameters) => {
  const indices = range(1, partial_decrypts.length + 1)

  const indices_as_bigs = indices.map((index) => [big(index)])
  const lambdas = indices_as_bigs.map((_, index) => moduloLambda(index, indices_as_bigs, q))

  const partials_to_lambdas = partial_decrypts.map((partial, index) => partial.modPow(lambdas[index], p))
  return product_bigs(partials_to_lambdas, p)
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
export function compute_g_to_keyshare(receivers_index_j: number, broadcasts: string[][], { p }: Parameters) {
  const g_to_rss = broadcasts.map((broadcast) => {
    const multiplicands = broadcast.map((b, k) => big(b).modPow(big(receivers_index_j).pow(k), p))

    return product_bigs(multiplicands, p)
  })

  return product_bigs(g_to_rss, p)
}

/** Creates non-interactive Zero Knowledge proof of a valid partial decryption
 *  by proving these two logs are equivalent:
 *
 *  log(g^trustees_secret)/log(g) = log(partial_decryption)/log(unlock_factor)
 *
 *  which are both equal to trustees_secret
 *
 *  @param ciphertext_unlock c[0] of the encrypted ciphertext (g ^ randomizer)
 *  @param trustees_secret
 *  @param {g, p, q} - Safe prime parameters
 *
 *  Based on Chaum-Pedersen ZK Proof of Discrete Logs
 *
 */
export async function generate_partial_decryption_proof(
  ciphertext_unlock: Big,
  trustees_secret: Big,
  { g, p, q }: Parameters,
) {
  // Prover picks a secret random integer less than q
  const secret_r = pickRandomInteger(q)

  const g_to_trustees_keyshare = g.modPow(trustees_secret, p)

  // Calculates Verifier's deterministic random number (Fiat-Shamir technique):
  const public_r = await integer_from_seed(`${ciphertext_unlock} ${g_to_trustees_keyshare}`, q)

  // Prover creates and sends:
  const obfuscated_trustee_secret = secret_r.add(public_r.multiply(trustees_secret))

  // Prover also shares commitment of their secret randomizer choice
  const g_to_secret_r = g.modPow(secret_r, p)
  const unlock_to_secret_r = ciphertext_unlock.modPow(secret_r, p)

  return { g_to_secret_r, obfuscated_trustee_secret, unlock_to_secret_r }
}

/** Verifies a non-interactive Zero Knowledge proof of a valid partial decryption
 *  by checking these two logs are equivalent:
 *
 *  log(g^trustees_secret)/log(g) = log(partial_decryption)/log(unlock_factor)
 *
 *  which are both equal to trustees_secret
 *
 *  @param ciphertext_unlock c[0] of the encrypted ciphertext (g ^ randomizer)
 *  @param g_to_trustees_keyshare - See `compute_g_to_keyshare()` func above
 *  @param partial_decryption - partial decryption to prove is valid
 *  @param {g, p, q} - Safe prime parameters
 *
 *  Based on Chaum-Pedersen ZK Proof of Discrete Logs
 *
 */
export async function verify_partial_decryption_proof(
  ciphertext_unlock: Big,
  g_to_trustees_keyshare: Big,
  partial_decryption: Big,
  {
    g_to_secret_r,
    obfuscated_trustee_secret,
    unlock_to_secret_r,
  }: AsyncReturnType<typeof generate_partial_decryption_proof>,
  { g, p, q }: Parameters,
): Promise<boolean> {
  // Recalculate deterministic verifier nonce
  const public_r = await integer_from_seed(`${ciphertext_unlock} ${g_to_trustees_keyshare}`, q)

  // Verifier checks:
  // g ^ obfuscated_trustee_secret
  const left_side_1 = g.modPow(obfuscated_trustee_secret, p)
  //   == g_to_secret_r * (g ^ trustee_secret ^ public_r)
  const right_side_1 = g_to_secret_r.multiply(g_to_trustees_keyshare.modPow(public_r, p)).mod(p)
  const check1 = left_side_1.equals(right_side_1)

  // And Verifier checks:
  // ciphertext_unlock ^ obfuscated_trustee_secret
  const left_side_2 = ciphertext_unlock.modPow(obfuscated_trustee_secret, p)
  //   == unlock_to_secret_r * (partial_decryption ^ public_r)
  const right_side_2 = unlock_to_secret_r.multiply(partial_decryption.modPow(public_r, p)).mod(p)
  const check2 = left_side_2.equals(right_side_2)

  return check1 && check2
}

/** Thereafter, compute
    m = c[2] / d
*/
export const unlock_message_with_shared_secret = (shared_secret: Big, sealed_data: Big, p: Big) => {
  const s_inverse = shared_secret.modInverse(p)
  const decrypted = sealed_data.multiply(s_inverse).mod(p)

  return decrypted.toString()
}
