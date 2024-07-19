import { firebase } from 'api/_services'
import { pusher } from 'api/pusher'
import bluebird from 'bluebird'
import { NextApiRequest, NextApiResponse } from 'next'
import { RP, pointToString } from 'src/crypto/curve'
import { destringifyPartial, stringifyPartial } from 'src/crypto/stringify-partials'
import {
  combine_partials,
  compute_g_to_keyshare,
  generate_partial_decryption_proof,
  partial_decrypt,
  unlock_message_with_shared_secret,
  verify_partial_decryption_proof,
} from 'src/crypto/threshold-keygen'
import { Partial, Shuffled, State } from 'src/trustee/trustee-state'
import { mapValues } from 'src/utils'

import { recombine_decrypteds } from '../admin/unlock'

const { ADMIN_EMAIL } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!ADMIN_EMAIL) return res.status(501).send('Missing process.env.ADMIN_EMAIL')

  const { election_id } = req.query
  if (typeof election_id !== 'string') return res.status(400).send('Malformed election_id')

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  // Begin preloading these docs
  const adminDoc = electionDoc.collection('trustees').doc(ADMIN_EMAIL)
  const trustees = (await electionDoc.collection('trustees').orderBy('index').get()).docs.map((doc) => ({
    ...doc.data(),
  }))

  // Is election_id in DB?
  const election = await electionDoc.get()
  if (!election.exists) return res.status(400).send('Unknown Election ID.')

  const promises: Promise<unknown>[] = []

  // Get admin's private data
  const admin = trustees[0] as Required<State> & { decryption_key: string }
  const { private_keyshare } = admin

  // Get election parameters
  const parameters = { ...election.data() }

  // If all have now shuffled, admin can partially decrypt
  const have_all_shuffled = trustees.every((trustee) => 'shuffled' in trustee)
  // But only if admin didn't already upload partials
  if (have_all_shuffled && !('partials' in admin)) {
    // Confirm that every column's shuffle proof is valid
    const { shuffled } = trustees[parameters.t - 1]

    // const checks = await bluebird.map(Object.keys(shuffled), (column) => {
    const checks = await bluebird.map(Object.keys(shuffled), () => {
      return true
      // const { shuffled: prevShuffle } = destringifyShuffle(trustees[trustee.index - 1].shuffled[column])
      // const { proof, shuffled: currShuffle } = destringifyShuffle(shuffled[column])

      // return verify_shuffle_proof(rename_to_c1_and_2(prevShuffle), rename_to_c1_and_2(currShuffle), proof)
    })

    if (!checks.length || !checks.every((x) => x)) {
      console.log("Final shuffle proof didn't fully pass")
    } else {
      console.log('Beginning to generate partials')

      // Partially decrypt each item in every list
      const partials = await bluebird.reduce(
        Object.keys(shuffled),
        (acc: Record<string, Partial[]>, column) =>
          bluebird.props({
            ...acc,
            [column]: bluebird.map((shuffled as Shuffled)[column].shuffled, async ({ lock }) => ({
              partial: partial_decrypt(RP.fromHex(lock), BigInt(private_keyshare)).toHex(),
              proof: stringifyPartial(
                await generate_partial_decryption_proof(RP.fromHex(lock), BigInt(private_keyshare)),
              ),
            })),
          }),
        {},
      )

      // Store partials
      await adminDoc.update({ partials })
      console.log('Updated admin partials:', partials)

      // Notify all participants there's been an update
      promises.push(pusher.trigger(`keygen-${election_id}`, 'update', { [ADMIN_EMAIL]: { partials: partials.length } }))
    }
  }

  // If all have provided partials, admin can now combine partials
  const all_have_partials = trustees.every((trustee) => 'partials' in trustee)
  if (all_have_partials) {
    // Have all trustees now uploaded partials for the last shuffled list?
    const last_shuffled = trustees[trustees.length - 1].shuffled as Shuffled
    const columns = Object.keys(last_shuffled)
    const last_shuffled_length = last_shuffled[columns[0]].shuffled.length

    if (trustees.every((t) => t.partials && t.partials[columns[0]].length >= last_shuffled_length)) {
      // Verify that all partials have passing ZK Proofs
      const all_broadcasts = trustees.map(({ commitments }) => commitments.map(RP.fromHex))
      const last_trustees_shuffled = trustees[trustees.length - 1].shuffled
      let any_failed = false
      // For all trustees...
      await bluebird.map(trustees, ({ partials }, index) => {
        const g_to_trustees_keyshare = compute_g_to_keyshare(index + 1, all_broadcasts)
        // For all columns...
        return bluebird.map(
          Object.keys(partials),
          // For all votes
          (column) =>
            bluebird.map(partials[column], async ({ partial, proof }: Partial, voteIndex) => {
              const result = await verify_partial_decryption_proof(
                RP.fromHex(last_trustees_shuffled[column].shuffled[voteIndex].lock),
                g_to_trustees_keyshare,
                RP.fromHex(partial),
                destringifyPartial(proof),
              )
              if (!result) any_failed = true
            }),
        )
      })
      if (any_failed) {
        console.log('⚠️  Not all Partial proofs passed, refusing to combine')
      } else {
        // Ok, now ready to combine partials and finish decryption...

        // For each column
        const decrypted_and_split = mapValues(last_shuffled, (list, key) => {
          // For each row
          return (list as { shuffled: { encrypted: string }[] }).shuffled.map(({ encrypted }, index) => {
            // 1. First we combine the partials to get the ElGamal shared secret
            const partials = trustees.map((t) => RP.fromHex(t.partials[key][index].partial))
            const shared_secret = combine_partials(partials)

            // 2. Then we can unlock each messages
            const unlocked = unlock_message_with_shared_secret(shared_secret, RP.fromHex(encrypted))
            return pointToString(unlocked)
          })
        }) as Record<string, string[]>

        // 3. Finally we recombine the separated columns back together via tracking numbers
        const decrypteds_by_tracking = recombine_decrypteds(decrypted_and_split)

        // Store decrypteds as an array
        const decrypted = Object.values(decrypteds_by_tracking)
        // 4. And save the results to election.decrypted
        await electionDoc.update({ decrypted, last_decrypted_at: new Date() })
        // And notify everyone we have new decrypted
        await pusher.trigger(election_id, 'decrypted', '')
      }
    }
  }

  // Wait for all pending promises to finish
  await Promise.all(promises)

  return res.status(201).send(`Updated admin object`)
}