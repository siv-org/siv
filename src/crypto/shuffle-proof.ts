import { CURVE } from '@noble/ed25519'
import { modPow } from 'bigint-mod-arith'

import { bigint_from_seed } from './bigint-from-seed'
import { G, RP, invert, mod, random_bigint, sum_bigints, sum_points } from './curve'

type ElGamalPair = { c1: RP; c2: RP }

export type SequencesOfPairs = ElGamalPair[]

export type Simple_Shuffle_Proof = {
  Gamma: RP
  Thetas: RP[]
  Xs: RP[]
  Ys: RP[]
  alphas: bigint[]
}

export type Shuffle_Proof = {
  As: RP[]
  Cs: RP[]
  Ds: RP[]
  Gamma: RP
  H: RP // Public_Threshold_Key aka Encryption_Address
  Lambda1: RP
  Lambda2: RP
  Us: RP[]
  Ws: RP[]
  sigmas: bigint[]
  simple_shuffle_proof: Simple_Shuffle_Proof
  tau: bigint
}

export async function generate_shuffle_proof(
  inputs: SequencesOfPairs,
  outputs: SequencesOfPairs,
  reencrypts: bigint[],
  permutes: number[],
  H: RP,
): Promise<Shuffle_Proof> {
  // All 4 input arrays need the same length
  const { length } = inputs
  if (outputs.length !== length || reencrypts.length !== length || permutes.length !== length) {
    throw new TypeError('Lengths mismatch')
  }

  // We'll use this permutation inverse a few times
  const permutation_inverse: number[] = []
  permutes.forEach((p, i) => (permutation_inverse[p] = i))

  // Prover generates lots of secret random values
  const us = inputs.map(random_bigint)
  const ws = inputs.map(random_bigint)
  const tau_0 = random_bigint()

  const as = inputs.map(random_bigint)
  const gamma = random_bigint()

  // Prover projects all these into p space
  const Us = us.map((u) => G.multiply(u))
  const Ws = ws.map((w) => G.multiply(mod(gamma * w)))
  const As = as.map((a) => G.multiply(a))
  const Cs = As.map((_, i) => As[permutes[i]].multiply(gamma))
  const Gamma = G.multiply(gamma)

  // Prover calculates... some things
  const sum = sum_bigints(ws.map((w, i) => w * reencrypts[permutes[i]]))

  const product1 = sum_points(inputs.map(({ c1 }, i) => c1.multiply(mod(ws[permutation_inverse[i]] - us[i]))))
  const Lambda1 = G.multiply(mod(tau_0 + sum)).add(product1)

  const product2 = sum_points(inputs.map(({ c2 }, i) => c2.multiply(mod(ws[permutation_inverse[i]] - us[i]))))
  const Lambda2 = H.multiply(mod(tau_0 + sum)).add(product2)

  // Replace Verifier's rho randoms with deterministic PRNG
  // using all the public values calculated so far
  const rhos = await prng.rhos(As, Cs, Us, Ws, Gamma, Lambda1, Lambda2)

  const bs = rhos.map((rho, i) => mod(rho - us[i]))
  const ds = inputs.map((_, i) => mod(gamma * bs[permutes[i]]))
  const Ds = ds.map((d) => G.multiply(d))

  // Challenger sends another deterministic PRNG value
  const lambda = await prng.lambda(Ds)

  const rs = as.map((a, i) => mod(a + lambda * bs[i]))
  const ss = rs.map((_, i) => mod(gamma * rs[permutes[i]]))
  const sigmas = ws.map((sigma, i) => mod(sigma + bs[permutes[i]]))

  const tau = mod(sum_bigints(bs.map((b, i) => b * reencrypts[i])) - tau_0)

  const simple_shuffle_proof = await generate_simple_shuffle_proof(rs, ss, gamma)

  return {
    As,
    Cs,
    Ds,
    Gamma,
    H,
    Lambda1,
    Lambda2,
    Us,
    Ws,
    sigmas,
    simple_shuffle_proof,
    tau,
  }
}

export async function verify_shuffle_proof(
  inputs: SequencesOfPairs,
  outputs: SequencesOfPairs,
  { As, Cs, Ds, Gamma, H, Lambda1, Lambda2, Us, Ws, sigmas, simple_shuffle_proof, tau }: Shuffle_Proof,
  { debug } = { debug: false },
): Promise<boolean> {
  const log = debug ? console.log : () => {}

  // Recalculate Deterministic PRNG values
  const rhos = await prng.rhos(As, Cs, Us, Ws, Gamma, Lambda1, Lambda2)
  log(`rhos = ${rhos.join(', ')}`)
  const lambda = await prng.lambda(Ds)
  log(`lambda = ${lambda}`)

  const Bs = rhos.map((rho, i) => G.multiplyUnsafe(rho).subtract(Us[i]))

  const Rs = As.map((A, i) => A.add(Bs[i].multiplyUnsafe(lambda)))
  const Ss = Cs.map((C, i) => C.add(Ds[i].multiplyUnsafe(lambda)))

  log(`Rs = ${Rs.join(', ')}`)
  log(`Ss = ${Ss.join(', ')}`)

  // Check all the simple_shuffle_proof values match
  if (!Gamma.equals(simple_shuffle_proof.Gamma)) return false
  if (Rs.length !== simple_shuffle_proof.Xs.length) return false
  if (Ss.length !== simple_shuffle_proof.Ys.length) return false
  if (!Rs.every((R, i) => R.equals(simple_shuffle_proof.Xs[i]))) return false
  if (!Ss.every((S, i) => S.equals(simple_shuffle_proof.Ys[i]))) return false
  log('all simple_shuffle_proof values match')

  if (!(await verify_simple_shuffle_proof(simple_shuffle_proof))) return false
  log('simple_shuffle_proof is valid')

  const Phi1 = outputs.reduce(
    (accum, output, i) =>
      accum.add(output.c1.multiplyUnsafe(sigmas[i])).add(inputs[i].c1.multiplyUnsafe(mod(-rhos[i]))),
    RP.ZERO,
  )

  const Phi2 = outputs.reduce(
    (accum, output, i) =>
      accum.add(output.c2.multiplyUnsafe(sigmas[i])).add(inputs[i].c2.multiplyUnsafe(mod(-rhos[i]))),
    RP.ZERO,
  )

  // Sigma equality checks
  if (
    !sigmas.every((sigma, i) => {
      const left = Gamma.multiplyUnsafe(sigma)
      const right = Ws[i].add(Ds[i])
      log(`Sigma ${i}: ${left} ==? ${right}`)
      return left.equals(right)
    })
  ) {
    return false
  }

  // Lambda equality checks
  {
    const left = Lambda1.add(G.multiplyUnsafe(tau))
    const right = Phi1
    log(`Lambda1: ${left} ==? ${right}`)
    if (!left.equals(right)) return false
  }

  {
    const left = Lambda2.add(H.multiplyUnsafe(tau))
    const right = Phi2
    log(`Lambda2: ${left} ==? ${right}`)
    if (!left.equals(right)) return false
  }

  return true
}

// based on http://www.cs.tau.ac.il/~fiat/crypt07/papers/neff.pdf
// g - prime group generator
// x - k-length array
// y - k-length array
// pi - permutation array
// gamma - exponent
// X[i] = g.modPow(x[i], p)
// Y[i] = g.modPow(y[i], p)
// Y[i] = X[pi[i]]^gamma
async function generate_simple_shuffle_proof(xs: bigint[], ys: bigint[], gamma: bigint): Promise<Simple_Shuffle_Proof> {
  const k = xs.length

  const Xs = xs.map((x) => G.multiply(x))
  const Ys = ys.map((y) => G.multiply(y))

  // SSA. 1. V generates a random t ∈ Zq and gives t to P as a challenge.
  const t = await prng.t(Xs, Ys)

  // console.log(`t = ${t}`)

  // SSA. 2.
  const x_hats = xs.map((x) => mod(x - t))
  const y_hats = ys.map((y) => mod(y - mod(gamma * t)))

  // console.log(`x_hats = ${x_hats}, y_hats = ${y_hats}`)
  // console.log(
  //   `X_hats = ${x_hats.map((x_hat) => G.multiply(x_hat))}, Y_hats = ${y_hats.map((y_hat) =>
  //     G.multiply(y_hat),
  //   )}`,
  // )

  const thetas = new Array(2 * k - 1).fill('').map(random_bigint)

  // console.log(`thetas = ${thetas}`)

  const Thetas = thetas.map((theta, i) => {
    if (i === 0) return G.multiply(mod(-theta * y_hats[0]))
    if (i < k) {
      return G.multiply(mod(thetas[i - 1] * x_hats[i] - theta * y_hats[i]))
    }
    if (i < 2 * k - 1) {
      return G.multiply(mod(gamma * thetas[i - 1] - theta))
    }
    throw new Error('count mismatch')
  })
  Thetas.push(G.multiply(mod(gamma * thetas[2 * k - 2])))

  // SSA. 3. V generates a random challenge c ∈ Zq and reveals it to P
  const c = await prng.c(Thetas)

  // console.log(`c = ${c}`)

  // SSA. 4. P computes 2k − 1 elements, α1, . . . , α2k−1, of Zq
  let product = BigInt(1) // intermediate value
  const alphas = thetas.map((theta, i) => {
    let multiplicand: bigint
    if (i < k) {
      product = mod(product * x_hats[i] * invert(y_hats[i]))
      multiplicand = product
    } else {
      multiplicand = modPow(gamma, mod(BigInt(i - 2 * k)), CURVE.l)
    }
    return mod(theta + c * multiplicand)
  })

  // 2nd way to calculate alphas
  // var prod = big(1)
  // for (var i = k - 2; i >= 0; i--) {
  //     prod = prod.multiply(y_hat[i + 1]).multiply(x_hat[i + 1].modInverse(q)).mod(q)
  //     alpha[i] = theta[i]
  //       .add(c.multiply(gamma.modPow(big(-k).mod(q.subtract(big(1))), q)).multiply(prod))
  //       .mod(q)
  // }

  // var add_me = big(1).subtract(big(2).multiply(big(k)))
  // for (var i = k - 1; i < 2*k - 1; i++) {
  //     alpha[i] = theta[i]
  //       .add(c.multiply(gamma.modPow(big(i).add(add_me).mod(q.subtract(big(1))), q)))
  //       .mod(q)
  // }

  return {
    Gamma: G.multiply(gamma),
    Thetas,
    Xs,
    Ys,
    alphas,
  }
}

async function verify_simple_shuffle_proof({ Gamma, Thetas, Xs, Ys, alphas }: Simple_Shuffle_Proof) {
  // console.log('Beginning verify_simple_shuffle_proof...')

  const k = Xs.length

  // SSA. 1. V generates a random t ∈ Zq and gives t to P as a challenge.
  const t = await prng.t(Xs, Ys)

  // console.log(`t = ${t}`)

  // SSA. 3. V generates a random challenge c ∈ Zq and reveals it to P
  const c = await prng.c(Thetas)

  // console.log(`c = ${c}`)

  // SSA. 5. V computes
  const U = G.multiplyUnsafe(mod(-t))
  const W = Gamma.multiplyUnsafe(mod(-t))

  // console.log(`U = ${U}, W = ${W}`)

  const X_hats = Xs.map((X) => X.add(U))
  const Y_hats = Ys.map((Y) => Y.add(W))
  // console.log(`X_hats = ${X_hats}, Y_hats = ${Y_hats}`)

  // and checks each of the following 2k equations:
  for (let i = 0; i < k; i += 1) {
    const left = X_hats[i].multiplyUnsafe(i === 0 ? c : alphas[i - 1]).add(Y_hats[i].multiplyUnsafe(mod(-alphas[i])))
    const right = Thetas[i]
    // console.log(`left = ${left}, right = ${right}`)
    if (!left.equals(right)) return false
  }

  // console.log('halfway there..')

  for (let i = k; i < 2 * k; i += 1) {
    const left = Gamma.multiplyUnsafe(alphas[i - 1]).add(G.multiplyUnsafe(mod(i < 2 * k - 1 ? -alphas[i] : -c)))
    const right = Thetas[i]
    // console.log(`left = ${left}, right = ${right}`)
    if (!left.equals(right)) return false
  }

  // console.log('Simple shuffle proof passed')

  return true
}

// Fiat-Shamir deterministic PRNG challenge integers
const prng = {
  c: (Thetas: RP[]) => bigint_from_seed(Thetas.join(',')),
  lambda: (Ds: RP[]) => bigint_from_seed(Ds.join(',')),
  rhos: (As: RP[], Cs: RP[], Us: RP[], Ws: RP[], Gamma: RP, Lambda1: RP, Lambda2: RP) =>
    Promise.all(As.map((_, i) => bigint_from_seed([As[i], Cs[i], Us[i], Ws[i], Gamma, Lambda1, Lambda2].join(',')))),
  t: (Xs: RP[], Ys: RP[]) => bigint_from_seed(Xs.concat(Ys).join(',')),
}
