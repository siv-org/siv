import bluebird from 'bluebird'
import { expect, test } from 'bun:test'
import { isEqual, range } from 'lodash'

import { pointToString, random_bigint, stringToPoint } from '../curve'
import decrypt from '../decrypt'
import encrypt from '../encrypt'
import { generate_key_pair } from '../generate-key-pair'
import { rename_to_c1_and_2, shuffleWithProof } from '../shuffle'
import { verify_shuffle_proof } from '../shuffle-proof'

test('Can Verifiably Shuffle (permute & re-encrypt) a list of votes, with valid proof', async () => {
  const num_tests = 1
  let num_passed = 0
  let num_ran = 0
  await bluebird.map(
    new Array(num_tests).fill(''),
    async () => {
      const sample_size = 5
      const { decryption_key, public_key } = generate_key_pair()

      const plaintexts = range(sample_size).map((_, index) => `${'ABCDE'.split('')[index]}`)
      // console.log({ plaintexts })

      const encrypted_votes = plaintexts.map((plaintext) =>
        encrypt(public_key, random_bigint(), stringToPoint(plaintext)),
      )
      // console.log('encrypted_votes:', encrypted_votes.map(toStrings))

      // Shuffle votes
      const { proof, shuffled } = await shuffleWithProof(public_key, encrypted_votes)
      // console.log('shuffled:', shuffled.map(toStrings))

      // Expect none of the previous ciphertexts are in the newly shuffled list
      shuffled.forEach((cipher) => {
        expect(
          encrypted_votes.some((unshuffled) => isEqual(cipher, unshuffled)),
          `${cipher} found in previous list`,
        ).toBe(false)
      })

      // Decrypt the votes
      const decrypteds = shuffled.map((cipher) => {
        const decrypted = decrypt(decryption_key, cipher)
        // console.log({ decrypted })

        const decoded = pointToString(decrypted)
        // console.log({ decoded })
        return decoded
      })

      // Expect all our original messages to be in there
      decrypteds.forEach((decrypted) => {
        expect(plaintexts.includes(decrypted), `${decrypted} wasn't in original plaintexts`).toBe(true)
      })

      // Expect the list to have been permuted.
      //   We can check if at least one of the decrypted values
      //   is different from the original plaintext at same index
      //   ( There's a 1 / 5! chance (1/120) this will fail by chance )
      expect(decrypteds.some((decrypted, index) => decrypted !== plaintexts[index])).toBe(true)

      // Expect the proof to verify true
      const good = await verify_shuffle_proof(rename_to_c1_and_2(encrypted_votes), rename_to_c1_and_2(shuffled), proof)
      num_ran += 1
      if (good) num_passed += 1
      // console.log({ good, num_passed, num_ran })
    },
    { concurrency: 1 },
  )

  expect(num_passed, 'Shuffle proofs did not all verify').toBe(num_ran)

  // console.log({ num_passed })
})
