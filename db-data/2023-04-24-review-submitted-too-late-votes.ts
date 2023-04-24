import './_env'

import { keyBy, mapValues } from 'lodash'

import { firebase } from '../pages/api/_services'
import { RP, pointToString } from '../src/crypto/curve'
import decrypt from '../src/crypto/decrypt'
import { CipherStrings } from '../src/crypto/stringify-shuffle'
import { tallyVotes } from '../src/status/tally-votes'

// CHANGE ME 👇
const election_id = '1680323766282'

const { ADMIN_EMAIL } = process.env
if (!ADMIN_EMAIL) throw 'Missing process.env.ADMIN_EMAIL'
;(async function main() {
  const db = firebase.firestore()
  const electionDoc = db.collection('elections').doc(election_id)

  console.log('Loading election data...\n')
  const admin = electionDoc.collection('trustees').doc(ADMIN_EMAIL).get()
  const election = electionDoc.get()
  const { ballot_design: ballot_design_string, last_decrypted_at } = { ...(await election).data() } as {
    ballot_design: string
    last_decrypted_at: Date
  }
  const notUnlockedVotesDocs = await electionDoc.collection('votes').where('created_at', '>', last_decrypted_at).get()
  console.log('Found not-yet-unlocked votes:', notUnlockedVotesDocs.docs.length)
  const { private_keyshare: decryption_key } = { ...(await admin).data() } as { private_keyshare: string }
  console.log("Found admin's key")

  const notUnlockedVotes = notUnlockedVotesDocs.docs.map((vote) => {
    const data = { ...vote.data() } as { auth: string; encrypted_vote: Record<string, CipherStrings> }
    // Decrypt
    const decryptedWithVerification = mapValues(data.encrypted_vote, (cipher) =>
      pointToString(decrypt(BigInt(decryption_key), mapValues(cipher, RP.fromHex))),
    )

    // Separate Verification # from other fields
    const decrypted: Record<string, string> = {}
    Object.entries(decryptedWithVerification).forEach(([key, value], index) => {
      const [unpadded_tracking, selection] = value.split(':')
      const tracking = unpadded_tracking.padStart(14, '0')

      // Skip if 'BLANK'
      if (selection === 'BLANK') return

      // Store tracking if first
      if (index === 0) decrypted.tracking = tracking

      // Throw if tracking changes
      if (tracking !== decrypted.tracking)
        throw `${vote.id} tracking changed. Expected ${decrypted.tracking}. Item '${key}' has ${tracking}`

      decrypted[key] = selection
    })

    return { auth: data.auth, decrypted, id: vote.id }
  })

  // Sum up the results from just these votes
  const ballot_design = JSON.parse(ballot_design_string) as { id: string }[]
  const { tallies, totalsCastPerItems } = tallyVotes(
    keyBy(ballot_design, 'id'),
    notUnlockedVotes.map((r) => r.decrypted),
  )

  const talliesWithPcts: Record<string, Record<string, [number, string]>> = {}
  ballot_design
    .map((i) => i.id)
    .forEach((contest_id) => {
      const contest_results = tallies[contest_id]
      talliesWithPcts[contest_id] = mapValues(contest_results, (tally): [number, string] => {
        const percentage = ((tally / totalsCastPerItems[contest_id]) * 100).toFixed(1) + '%'
        return [tally, percentage]
      })
    })
  console.log(talliesWithPcts)

  console.log(notUnlockedVotes)
})()
