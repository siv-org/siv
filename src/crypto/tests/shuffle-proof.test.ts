import bluebird from 'bluebird'
import { expect, test } from 'bun:test'

import { G, mod, random_bigint, RP, stringToPoint } from '../curve'
import { generate_key_pair } from '../generate-key-pair'
import { pick_random_bigint } from '../pick-random-bigint'
import { rename_to_c1_and_2, shuffleWithProof } from '../shuffle'
import { generate_shuffle_proof, SequencesOfPairs, SHUFFLE_PROOF_VERSION, verify_shuffle_proof } from '../shuffle-proof'
import { destringifyShuffle, stringifyShuffle } from '../stringify-shuffle'

test('Can Verifiably Shuffle (permute & re-encrypt) a list of votes', async () => {
  const num_votes = 5

  const k = num_votes

  const num_tests = 10
  // console.log(`Trying proof ${num_tests} times`)
  let num_passed = 0

  await bluebird.map(
    new Array(num_tests).fill(''),
    async () => {
      // Election keypair
      const { public_key } = generate_key_pair()

      // Generate ElGamal pairs for testing
      const inputs = [...new Array(k).keys()].map(() => {
        const randomizer = random_bigint()
        const m = pick_random_bigint(BigInt(10 ** 8))
        const message = stringToPoint(m.toString())

        // Calculate our encrypted message
        const shared_secret = public_key.multiply(randomizer)
        const encrypted = message.add(shared_secret)

        // This unlock factor lets someone with the decryption key reverse the encryption
        const lock = G.multiply(randomizer)

        return {
          c1: lock,
          c2: encrypted,
        }
      })

      // Build permutation array
      const pi: number[] = []
      const options = [...new Array(k).keys()]
      while (options.length) {
        const i = Math.floor(Math.random() * options.length)
        pi.push(options.splice(i, 1)[0])
      }
      // console.log(`pi = ${pi}`)

      const reencryption_array = inputs.map(() => random_bigint())

      // Create shuffled list
      const outputs: typeof inputs = []
      for (let i = 0; i < k; i += 1) {
        const r = reencryption_array[pi[i]]
        outputs.push({
          c1: inputs[pi[i]].c1.add(G.multiply(r)),
          c2: inputs[pi[i]].c2.add(public_key.multiply(r)),
        })
      }

      let good = false
      const proof = await generate_shuffle_proof(inputs, outputs, reencryption_array, pi, public_key)
      good = await verify_shuffle_proof(inputs, outputs, proof, public_key)

      if (good) num_passed += 1

      // console.log(`${num_passed} passed of ${test_num}`, num_passed / test_num)
    },
    { concurrency: 1 },
  )
  expect(num_passed, 'Invalid shuffle proof').toBe(num_tests)
})

test('rejects tampered outputs / inputs / H', async () => {
  const { public_key } = generate_key_pair()
  const inputs = random_elgamal_pairs(3, public_key)
  const { outputs, pi, reencrypts } = shuffle(inputs, public_key)
  const proof = await generate_shuffle_proof(inputs, outputs, reencrypts, pi, public_key)
  const two = BigInt(2)

  expect(proof.version).toBe(SHUFFLE_PROOF_VERSION)

  // valid proof
  expect(await verify_shuffle_proof(inputs, outputs, proof, public_key)).toBe(true)

  // tampered outputs
  expect(
    await verify_shuffle_proof(
      inputs,
      [{ ...outputs[0], c1: outputs[0].c1.multiply(two) }, ...outputs.slice(1)],
      proof,
      public_key,
    ),
  ).toBe(false)

  // tampered inputs
  expect(
    await verify_shuffle_proof(
      [{ ...inputs[0], c1: inputs[0].c1.multiply(two) }, ...inputs.slice(1)],
      outputs,
      proof,
      public_key,
    ),
  ).toBe(false)

  // tampered H (eg proof was bound to a different H)
  const tampered_H = public_key.multiply(two)
  expect(await verify_shuffle_proof(inputs, outputs, { ...proof, H: tampered_H }, tampered_H)).toBe(false)
})

test('rejects proof.H that does not match the election key', async () => {
  const { public_key } = generate_key_pair()
  const inputs = random_elgamal_pairs(2, public_key)
  const { outputs, pi, reencrypts } = shuffle(inputs, public_key)
  const proof = await generate_shuffle_proof(inputs, outputs, reencrypts, pi, public_key)

  expect(await verify_shuffle_proof(inputs, outputs, proof, public_key)).toBe(true)
  expect(await verify_shuffle_proof(inputs, outputs, { ...proof, H: public_key.multiply(BigInt(2)) }, public_key)).toBe(
    false,
  )
})

test('rejects Phi-preserving output swap', async () => {
  /* Phi-preserving output swap — keeps Phi fixed under reused sigmas, so Lambda checks alone wouldn't catch it.
  Must reject because outputs are bound into the Fiat–Shamir seed.
    outputs'[0].c1 += σ₁·G
    outputs'[1].c1 -= σ₀·G
  */
  const { public_key } = generate_key_pair()
  const inputs = random_elgamal_pairs(3, public_key)
  const { outputs, pi, reencrypts } = shuffle(inputs, public_key)
  const proof = await generate_shuffle_proof(inputs, outputs, reencrypts, pi, public_key)
  expect(await verify_shuffle_proof(inputs, outputs, proof, public_key)).toBe(true)

  const [s0, s1] = proof.sigmas
  const swapped = outputs.map((o, i) => {
    if (i === 0) return { ...o, c1: o.c1.add(G.multiply(s1)) }
    if (i === 1) return { ...o, c1: o.c1.add(G.multiply(mod(-s0))) }
    return o
  })

  expect(await verify_shuffle_proof(inputs, swapped, proof, public_key)).toBe(false)
})

test('cleanly returns false on mismatched lengths, not throw', async () => {
  const { public_key } = generate_key_pair()
  const inputs = random_elgamal_pairs(3, public_key)
  const { outputs, pi, reencrypts } = shuffle(inputs, public_key)
  const proof = await generate_shuffle_proof(inputs, outputs, reencrypts, pi, public_key)

  const cases: [string, Parameters<typeof verify_shuffle_proof>][] = [
    ['inputs shorter', [inputs.slice(0, 2), outputs, proof, public_key]],
    ['outputs shorter', [inputs, outputs.slice(0, 2), proof, public_key]],
    ['As shorter', [inputs, outputs, { ...proof, As: proof.As.slice(0, 2) }, public_key]],
    ['Cs shorter', [inputs, outputs, { ...proof, Cs: proof.Cs.slice(0, 2) }, public_key]],
    ['Us shorter', [inputs, outputs, { ...proof, Us: proof.Us.slice(0, 2) }, public_key]],
    ['Ws shorter', [inputs, outputs, { ...proof, Ws: proof.Ws.slice(0, 2) }, public_key]],
    ['Ds shorter', [inputs, outputs, { ...proof, Ds: proof.Ds.slice(0, 2) }, public_key]],
    ['sigmas shorter', [inputs, outputs, { ...proof, sigmas: proof.sigmas.slice(0, 2) }, public_key]],
  ]

  for (const [label, args] of cases) {
    expect(await verify_shuffle_proof(...args), label).toBe(false)
  }
})

test('throws on missing or unsupported proof version', async () => {
  const { public_key } = generate_key_pair()
  const votes = random_elgamal_pairs(2, public_key).map(({ c1, c2 }) => ({ encrypted: c2, lock: c1 }))
  const { proof, shuffled } = await shuffleWithProof(public_key, votes)
  const stored = stringifyShuffle({ proof, shuffled })

  expect(() => destringifyShuffle({ ...stored, proof: { ...stored.proof, version: undefined as never } })).toThrow(
    /version/,
  )
  expect(() => destringifyShuffle({ ...stored, proof: { ...stored.proof, version: 1 as never } })).toThrow(/version/)

  expect(
    verify_shuffle_proof(
      rename_to_c1_and_2(votes),
      rename_to_c1_and_2(shuffled),
      {
        ...proof,
        version: undefined as never,
      },
      public_key,
    ),
  ).rejects.toThrow(/version/)
})

function random_elgamal_pairs(k: number, public_key: RP): SequencesOfPairs {
  return [...new Array(k).keys()].map(() => {
    const r = random_bigint()
    const m = stringToPoint(pick_random_bigint(BigInt(10 ** 8)).toString())
    return { c1: G.multiply(r), c2: m.add(public_key.multiply(r)) }
  })
}

function shuffle(inputs: SequencesOfPairs, public_key: RP) {
  const options = [...new Array(inputs.length).keys()]
  const pi: number[] = []
  while (options.length) pi.push(options.splice(Math.floor(Math.random() * options.length), 1)[0])
  const reencrypts = inputs.map(() => random_bigint())
  const outputs = pi.map((src) => ({
    c1: inputs[src].c1.add(G.multiply(reencrypts[src])),
    c2: inputs[src].c2.add(public_key.multiply(reencrypts[src])),
  }))
  return { outputs, pi, reencrypts }
}
