// Based on https://www.sci-hub.tw/10.1007/s00145-006-0347-3
// "Secure Distributed Key Generation for Discrete-Log Based Cryptosystems"
// by Rosario Gennaro, Stanislaw Jarecki, Hugo Krawczyk and Tal Rabin
// Section 3 Figure 1

import { range } from 'lodash'

import { moduloLambda } from './lagrange'
import pickRandomInteger from './pick-random-integer'
import { Big, big } from './types'

export type Parameters = { g: Big; p: Big; q: Big }

/** Sum up an array of Bigs */
const sum_bigs = (bigs: Big[], modulo: Big): Big => bigs.reduce((memo, term) => memo.add(term).mod(modulo))

/** Multiply up an array of Bigs */
const product_bigs = (bigs: Big[], modulo: Big): Big => bigs.reduce((memo, term) => memo.multiply(term).mod(modulo))

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

 g^(s[i,j]) = Product( k=0, t ){ (A[i,k]) ^j ^k mod p }

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
export const partial_decrypt = (sealing_factor: Big, private_key_share: Big, { p }: Parameters) =>
  sealing_factor.modPow(private_key_share, p)

/** then compute:
    d = d[1]^λ[1] ... d[t]^λ[t]
      = c[1]^(s[1]λ[1]) ... c[1]^(s[t]λ[t])
      = c[1]^a
*/
export const combine_partials = (partial_decrypts: Big[], { p, q }: Parameters) => {
  // var prod = big(1)
  // partial_decrypts.forEach((part, i) => {
  //     let L = big(1)
  //     partial_decrypts.forEach((_, ii) => {
  //         let I = big(i + 1)
  //         let II = big(ii + 1)
  //         if (I.equals(II)) return
  //         let num = big(0).subtract(II).mod(q)
  //         let den = I.subtract(II).mod(q)

  //         // console.log(`I = ${I}, II = ${II}, num = ${num}, den = ${den}, q = ${q}`)

  //         L = L.multiply(num.multiply(den.modInverse(q)).mod(q)).mod(q)
  //     })
  //     prod = prod.multiply(part.modPow(L, p)).mod(p)
  // })
  // return prod

  const indices = range(1, partial_decrypts.length + 1)

  const indices_as_bigs = indices.map((index) => [big(index)])
  const lambdas = indices_as_bigs.map((_, index) => moduloLambda(index, indices_as_bigs, q))

  const partials_to_lambdas = partial_decrypts.map((partial, index) => partial.modPow(lambdas[index], p))
  return product_bigs(partials_to_lambdas, p)
}

/** Use Zero knowledge proof to prove
    log[c[1]](dⱼ) = log[g](hⱼ)

    g = generator
    gs = g^s (s is the global secret)
    c[0] = unlock_factor of the encrypted (g ^ randomizer)
    t.part = partial for a given trustee
    t.s = secret for a given trustee

    log_proof(g, gs, c[0], t.part, t.s)
*/
// function log_proof(g, x, h, y, alpha) {
// for (var i = 0; i < 100; i++) {
//     // prover creates:
//     let w = rand(big(1), q)

//     // prover sends:
//     let gw = g.modPow(w, p)
//     let hw = h.modPow(w, p)

//     // verifier creates and sends:
//     let c = rand(big(1), q)

//     // prover creates and sends:
//     let r = w.add(c.multiply(alpha))

//     // verifier checks:
//     var check = g.modPow(r, p).equals(gw.multiply(x.modPow(c, p)).mod(p))
//        && h.modPow(r, p).equals(hw.multiply(y.modPow(c, p)).mod(p))
//     if (!check) return false
// }
// return true
// }

/** Thereafter, compute
    m = c[2] / d
*/
export const unlock_message_with_shared_secret = (shared_secret: Big, sealed_data: Big, p: Big) => {
  const s_inverse = shared_secret.modInverse(p)
  const decrypted = sealed_data.multiply(s_inverse).mod(p)

  return decrypted.toString()
}
