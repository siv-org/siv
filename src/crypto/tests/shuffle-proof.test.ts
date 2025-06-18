import bluebird from 'bluebird'
import { expect, test } from 'bun:test'

import { G, random_bigint, stringToPoint } from '../curve'
import { generate_key_pair } from '../generate-key-pair'
import { pick_random_bigint } from '../pick-random-bigint'
import { generate_shuffle_proof, verify_shuffle_proof } from '../shuffle-proof'

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
      good = await verify_shuffle_proof(inputs, outputs, proof)

      if (good) num_passed += 1

      // console.log(`${num_passed} passed of ${test_num}`, num_passed / test_num)
    },
    { concurrency: 1 },
  )
  expect(num_passed, 'Invalid shuffle proof').toBe(num_tests)
})
