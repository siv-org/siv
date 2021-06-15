/* eslint-disable no-console */
import { integer_from_seed } from './integer-from-seed'
import pick_random_integer from './pick-random-integer'
import { product_bigs, sum_bigs } from './threshold-keygen'
import { Big, big } from './types'

type ElGamalPair = { c1: Big; c2: Big }

type SequencesOfPairs = ElGamalPair[]

type Simple_Shuffle_Proof = {
  Gamma: Big
  Thetas: Big[]
  Xs: Big[]
  Ys: Big[]
  alphas: Big[]
  parameters: Parameters
}

export type Shuffle_Proof = {
  As: Big[]
  Cs: Big[]
  Ds: Big[]
  Gamma: Big
  Lambda1: Big
  Lambda2: Big
  Us: Big[]
  Ws: Big[]
  inputs: SequencesOfPairs
  outputs: SequencesOfPairs
  parameters: ParametersWithH
  sigmas: Big[]
  simple_shuffle_proof: Simple_Shuffle_Proof
  tau: Big
}

type Parameters = {
  g: Big
  p: Big // Safe Prime
  q: Big // Sophie-Germain Prime
}

type ParametersWithH = Parameters & {
  h: Big // Public_Threshold_Key aka Encryption_Address
}

export async function generate_shuffle_proof(
  inputs: SequencesOfPairs,
  outputs: SequencesOfPairs,
  reencrypts: Big[],
  permutes: number[],
  { g, h, p, q }: ParametersWithH,
): Promise<Shuffle_Proof> {
  // All 4 input arrays need the same length
  const { length } = inputs
  if (outputs.length !== length || reencrypts.length !== length || permutes.length !== length) {
    throw new TypeError('Lengths mismatch')
  }

  // We'll use this permutation inverse a few times
  const permutation_inverse: number[] = []
  permutes.forEach((permute, i) => {
    permutation_inverse[permute] = i
  })

  // Prover generates lots of secret random values
  const us = inputs.map(() => pick_random_integer(q))
  const ws = inputs.map(() => pick_random_integer(q))
  const tau_0 = pick_random_integer(q)

  const as = inputs.map(() => pick_random_integer(q))
  const gamma = pick_random_integer(q)

  // Prover projects all these into p space
  const Us = us.map((u) => g.modPow(u, p))
  const Ws = ws.map((w) => g.modPow(gamma.multiply(w).mod(q), p))
  const As = as.map((a) => g.modPow(a, p))
  const Cs = As.map((_, i) => As[permutes[i]].modPow(gamma, p))
  const Gamma = g.modPow(gamma, p)

  // Prover calculates... some things
  const sum = sum_bigs(
    ws.map((w, i) => w.multiply(reencrypts[permutes[i]])),
    q,
  )

  const product1 = product_bigs(
    inputs.map(({ c1 }, i) => c1.modPow(ws[permutation_inverse[i]].subtract(us[i]).mod(q), p)),
    p,
  )
  const Lambda1 = g.modPow(tau_0.add(sum), p).multiply(product1).mod(p)

  // The exponent may be negative, so we'll mod it first, but c2 may not be in the Q subgroup,
  // so we mod the exponent by p - 1, which is safe via Fermat's Little Theorem.
  const product2 = product_bigs(
    inputs.map(({ c2 }, i) => c2.modPow(ws[permutation_inverse[i]].subtract(us[i]).mod(p.subtract(big(1))), p)),
    p,
  )
  const Lambda2 = h.modPow(tau_0.add(sum), p).multiply(product2).mod(p)

  // Replace Verifier's rho randoms with deterministic PRNG
  // using all the public values calculated so far
  const rhos = await prng.rhos(As, Cs, Us, Ws, Gamma, Lambda1, Lambda2, q)

  const bs = rhos.map((rho, i) => rho.subtract(us[i]).mod(p.subtract(big(1))))
  const ds = inputs.map((_, i) => gamma.multiply(bs[permutes[i]]))
  const Ds = ds.map((d) => g.modPow(d, p))

  // Challenger sends another deterministic PRNG value
  const lambda = await prng.lambda(Ds, q)

  const rs = as.map((a, i) => a.add(lambda.multiply(bs[i])))
  const ss = rs.map((_, i) => gamma.multiply(rs[permutes[i]]).mod(q))
  const sigmas = ws.map((sigma, i) => sigma.add(bs[permutes[i]]))

  const tau = sum_bigs(
    bs.map((b, i) => b.multiply(reencrypts[i])),
    q,
  )
    .subtract(tau_0)
    .mod(q)

  const simple_shuffle_proof = await generate_simple_shuffle_proof({ g, p, q }, rs, ss, gamma)

  return {
    As,
    Cs,
    Ds,
    Gamma,
    Lambda1,
    Lambda2,
    Us,
    Ws,
    inputs,
    outputs,
    parameters: { g, h, p, q },
    sigmas,
    simple_shuffle_proof,
    tau,
  }
}

export async function verify_shuffle_proof(
  {
    As,
    Cs,
    Ds,
    Gamma,
    Lambda1,
    Lambda2,
    Us,
    Ws,
    inputs,
    outputs,
    parameters,
    sigmas,
    simple_shuffle_proof,
    tau,
  }: Shuffle_Proof,
  { debug } = { debug: false },
): Promise<boolean> {
  const log = debug ? console.log : () => {}
  const { g, h, p, q } = parameters

  // Recalculate Deterministic PRNG values
  const rhos = await prng.rhos(As, Cs, Us, Ws, Gamma, Lambda1, Lambda2, q)
  log(`rhos = ${rhos.join(', ')}`)
  const lambda = await prng.lambda(Ds, q)
  log(`lambda = ${lambda}`)

  const Bs = rhos.map((rho, i) => g.modPow(rho, p).multiply(Us[i].modInverse(p)).mod(p))

  const Rs = As.map((A, i) => A.multiply(Bs[i].modPow(lambda, p)).mod(p))
  const Ss = Cs.map((C, i) => C.multiply(Ds[i].modPow(lambda, p)).mod(p))

  log(`Rs = ${Rs.join(', ')}`)
  log(`Ss = ${Ss.join(', ')}`)

  // Check all the simple_shuffle_proof values match
  if (!p.equals(simple_shuffle_proof.parameters.p)) return false
  if (!q.equals(simple_shuffle_proof.parameters.q)) return false
  if (!g.equals(simple_shuffle_proof.parameters.g)) return false
  if (!Gamma.equals(simple_shuffle_proof.Gamma)) return false
  if (Rs.length !== simple_shuffle_proof.Xs.length) return false
  if (Ss.length !== simple_shuffle_proof.Ys.length) return false
  if (!Rs.every((r, i) => r.equals(simple_shuffle_proof.Xs[i]))) return false
  if (!Ss.every((S, i) => S.equals(simple_shuffle_proof.Ys[i]))) return false
  log('all simple_shuffle_proof values match')

  const is_simple_shuffle_proof_valid = await verify_simple_shuffle_proof(simple_shuffle_proof)
  if (!is_simple_shuffle_proof_valid) return false
  log('simple_shuffle_proof is valid')

  const Phi1 = outputs.reduce(
    (accum, output, i) =>
      accum
        .multiply(output.c1.modPow(sigmas[i], p))
        .mod(p)
        .multiply(inputs[i].c1.modPow(big(0).subtract(rhos[i]).mod(q), p))
        .mod(p),
    big(1),
  )

  const Phi2 = outputs.reduce(
    (accum, output, i) =>
      accum
        .multiply(output.c2.modPow(sigmas[i], p))
        .mod(p)
        .multiply(
          inputs[i].c2.modPow(
            big(0)
              .subtract(rhos[i])
              .mod(p.subtract(big(1))),
            p,
          ),
        )
        .mod(p),
    big(1),
  )

  // Sigma equality checks
  if (
    !sigmas.every((sigma, i) => {
      const left = Gamma.modPow(sigma, p)
      const right = Ws[i].multiply(Ds[i]).mod(p)
      log(`Sigma ${i}: ${left} ==? ${right}`)
      return left.equals(right)
    })
  ) {
    return false
  }

  // Lambda equality checks
  {
    const left = Lambda1.multiply(g.modPow(tau, p)).mod(p)
    const right = Phi1
    log(`Lambda1: ${left} ==? ${right}`)
    if (!left.equals(right)) return false
  }

  {
    const left = Lambda2.multiply(h.modPow(tau, p)).mod(p)
    const right = Phi2
    log(`Lambda2: ${left} ==? ${right}`)
    if (!left.equals(right)) return false
  }

  return true
}

// based on http://www.cs.tau.ac.il/~fiat/crypt07/papers/neff.pdf
// p, q, g - prime group parameters
// x - k-length array
// y - k-length array
// pi - permutation array
// gamma - exponent
// X[i] = g.modPow(x[i], p)
// Y[i] = g.modPow(y[i], p)
// Y[i] = X[pi[i]]^gamma
async function generate_simple_shuffle_proof(
  { g, p, q }: Parameters,
  xs: Big[],
  ys: Big[],
  gamma: Big,
): Promise<Simple_Shuffle_Proof> {
  const k = xs.length

  const Xs = xs.map((x) => g.modPow(x, p))
  const Ys = ys.map((y) => g.modPow(y, p))

  // SSA. 1. V generates a random t ∈ Zq and gives t to P as a challenge.
  const t = await prng.t(p, q, g, Xs, Ys)

  // console.log(`t = ${t}`)

  // SSA. 2.
  const x_hats = xs.map((x) => x.subtract(t).mod(q))
  const y_hats = ys.map((y) => y.subtract(gamma.multiply(t)).mod(q))

  // console.log(`x_hats = ${x_hats}, y_hats = ${y_hats}`)
  // console.log(
  //   `X_hats = ${x_hats.map((x_hat) => g.modPow(x_hat, p))}, Y_hats = ${y_hats.map((y_hat) =>
  //     g.modPow(y_hat, p),
  //   )}`,
  // )

  const thetas = new Array(2 * k - 1).fill('').map(() => pick_random_integer(q))

  // console.log(`thetas = ${thetas}`)

  const Thetas = thetas.map((theta, i) => {
    if (i === 0) return g.modPow(big(0).subtract(theta.multiply(y_hats[0])).mod(q), p)
    if (i < k) {
      return g.modPow(thetas[i - 1].multiply(x_hats[i]).subtract(theta.multiply(y_hats[i])).mod(q), p)
    }
    if (i < 2 * k - 1) {
      return g.modPow(
        gamma
          .multiply(thetas[i - 1])
          .subtract(theta)
          .mod(q),
        p,
      )
    }
    throw new Error('count mismatch')
  })
  Thetas.push(g.modPow(gamma.multiply(thetas[2 * k - 2]).mod(q), p))

  // SSA. 3. V generates a random challenge c ∈ Zq and reveals it to P
  const c = await prng.c(Thetas, q)

  // console.log(`c = ${c}`)

  // SSA. 4. P computes 2k − 1 elements, α1, . . . , α2k−1, of Zq
  let product = big(1) // intermediate value
  const alphas = thetas.map((theta, i) => {
    let multiplicand: Big
    if (i < k) {
      product = product.multiply(x_hats[i]).multiply(y_hats[i].modInverse(q)).mod(q)
      multiplicand = product
    } else {
      multiplicand = gamma.modPow(
        big(i)
          .add(big(1).subtract(big(2).multiply(big(k))))
          .mod(q.subtract(big(1))),
        q,
      )
    }
    return theta.add(c.multiply(multiplicand)).mod(q)
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
    Gamma: g.modPow(gamma, p),
    Thetas,
    Xs,
    Ys,
    alphas,
    parameters: { g, p, q },
  }
}

async function verify_simple_shuffle_proof({ Gamma, Thetas, Xs, Ys, alphas, parameters }: Simple_Shuffle_Proof) {
  // console.log('Beginning verify_simple_shuffle_proof...')
  const { g, p, q } = parameters

  const k = Xs.length

  // SSA. 1. V generates a random t ∈ Zq and gives t to P as a challenge.
  const t = await prng.t(p, q, g, Xs, Ys)

  // console.log(`t = ${t}`)

  // SSA. 3. V generates a random challenge c ∈ Zq and reveals it to P
  const c = await prng.c(Thetas, q)

  // console.log(`c = ${c}`)

  // SSA. 5. V computes
  const U = g.modPow(big(0).subtract(t).mod(q), p)
  const W = Gamma.modPow(big(0).subtract(t).mod(q), p)

  // console.log(`U = ${U}, W = ${W}`)

  const X_hats = Xs.map((X) => X.multiply(U).mod(p))
  const Y_hats = Ys.map((Y) => Y.multiply(W).mod(p))
  // console.log(`X_hats = ${X_hats}, Y_hats = ${Y_hats}`)

  // and checks each of the following 2k equations:
  for (let i = 0; i < k; i += 1) {
    const left = X_hats[i]
      .modPow(i === 0 ? c : alphas[i - 1], p)
      .multiply(Y_hats[i].modPow(big(0).subtract(alphas[i]).mod(q), p))
      .mod(p)
    const right = Thetas[i]
    // console.log(`left = ${left}, right = ${right}`)
    if (!left.equals(right)) return false
  }

  // console.log('halfway there..')

  for (let i = k; i < 2 * k; i += 1) {
    const left = Gamma.modPow(alphas[i - 1], p)
      .multiply(
        g.modPow(
          big(0)
            .subtract(i < 2 * k - 1 ? alphas[i] : c)
            .mod(q),
          p,
        ),
      )
      .mod(p)
    const right = Thetas[i]
    // console.log(`left = ${left}, right = ${right}`)
    if (!left.equals(right)) return false
  }

  // console.log('Simple shuffle proof passed')

  return true
}

// Fiat-Shamir deterministic PRNG challenge integers
const prng = {
  c: (Thetas: Big[], q: Big) => integer_from_seed(Thetas.join(','), q),
  lambda: (Ds: Big[], q: Big) => integer_from_seed(`${Ds.join(',')}`, q),
  rhos: (As: Big[], Cs: Big[], Us: Big[], Ws: Big[], Gamma: Big, Lambda1: Big, Lambda2: Big, q: Big) =>
    Promise.all(
      As.map((_, i) => integer_from_seed(`${As[i]} ${Cs[i]} ${Us[i]} ${Ws[i]} ${Gamma} ${Lambda1} ${Lambda2}`, q)),
    ),
  t: (p: Big, q: Big, g: Big, Xs: Big[], Ys: Big[]) =>
    integer_from_seed(`${p},${q},${g},${Xs.join(',')},${Ys.join(',')}`, q),
}
