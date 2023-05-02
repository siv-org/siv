import './_env'

import { inspect } from 'util'

import { keyBy, mapValues, pick } from 'lodash'
import UAParser from 'ua-parser-js'

import { firebase } from '../pages/api/_services'
import { RP, pointToString } from '../src/crypto/curve'
import decrypt from '../src/crypto/decrypt'
import { CipherStrings } from '../src/crypto/stringify-shuffle'
import { tallyVotes } from '../src/status/tally-votes'

const election_id = '1680323766282'

const expectedSelections = 4

;(async function main() {
  const db = firebase.firestore()
  const electionDoc = db.collection('elections').doc(election_id)

  const election = electionDoc.get()
  const { ballot_design: ballot_design_string } = { ...(await election).data() } as { ballot_design: string }
  const ballot_design = JSON.parse(ballot_design_string) as { id: string }[]

  // Get unlocking key
  const { ADMIN_EMAIL } = process.env
  if (!ADMIN_EMAIL) throw 'Missing process.env.ADMIN_EMAIL'
  const admin = electionDoc.collection('trustees').doc(ADMIN_EMAIL).get()
  const { private_keyshare: decryption_key } = { ...(await admin).data() } as { private_keyshare: string }

  // Download all submitted encrypted votes
  const votesDocs = await electionDoc.collection('votes').get()

  const totalNumBlanks = {}

  // Look through each, if it has any holes, mark the auth_token and number of holes
  const votesWithHoles: Record<
    number,
    Record<string, { decrypted: Record<string, string>; device: string; email: string; holes: number }>
  > = {}
  await Promise.all(
    votesDocs.docs.map(async (doc) => {
      const { auth, encrypted_vote, headers } = doc.data()

      // Decrypt the vote
      const decryptedWithVerification = mapValues(encrypted_vote as Record<string, CipherStrings>, (cipher) =>
        pointToString(decrypt(BigInt(decryption_key), mapValues(cipher, RP.fromHex))),
      )
      // Separate Verification # from other fields
      let numBlanks = 0
      const decrypted: Record<string, string> = {}
      Object.entries(decryptedWithVerification).forEach(([key, value], index) => {
        const [unpadded_tracking, selection] = value.split(':')
        const tracking = unpadded_tracking.padStart(14, '0')

        // Count 'BLANK's
        if (selection === 'BLANK') numBlanks++

        // Store tracking if first
        if (index === 0) decrypted.tracking = tracking

        decrypted[key] = selection
      })

      const holes = expectedSelections - Object.keys(encrypted_vote).length

      const key = `${numBlanks} BLANK, ${holes} hole`
      totalNumBlanks[key] = (totalNumBlanks[key] || 0) + 1

      if (!holes) return

      const voter = (await electionDoc.collection('voters').where('auth_token', '==', auth).get()).docs[0].data()
      const ua = UAParser(headers['user-agent'])

      if (!votesWithHoles[holes]) votesWithHoles[holes] = {}

      votesWithHoles[holes][auth] = {
        decrypted,
        device: `${ua.browser.name} ${ua.browser.version} on ${ua.os.name} ${ua.os.version}`,
        email: voter.email,
        holes,
      }
    }),
  )

  // Summarize the hole'd votes
  const holesSummary = {}
  Object.entries(votesWithHoles).forEach(([numHoles, votes]) => {
    const numOfType = Object.keys(votes).length
    const key = `${numOfType} with ${numHoles} hole${+numHoles !== 1 ? 's' : ''} (${formatPercentage(
      numOfType / votesDocs.docs.length,
    )})`

    // Sum up the results from just these votes
    const { tallies, totalsCastPerItems } = tallyVotes(
      keyBy(ballot_design, 'id'),
      Object.values(votes).map((v) => v.decrypted),
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

    holesSummary[key] = { _subset_tally: talliesWithPcts, ...mapValues(votes, (v) => pick(v, ['email', 'device'])) }
  })
  console.log(`Reviewed ${votesDocs.docs.length} encrypted votes`)
  console.log('Votes with holes:', inspect(holesSummary, { depth: null }))

  console.log('Num total blanks', totalNumBlanks)
})()

/** Converts a decimal number to a percentage string with up to 2 decimal places. */
const formatPercentage = (pct: number) => {
  const numDecimals = pct.toString().split('.')[1]?.length ?? 0
  const precision = Math.min(numDecimals, 2)
  const formattedPct = parseFloat((pct * 100).toFixed(precision)).toString()
  return `${formattedPct}%`
}
// testCases(formatPercentage, [
//   [[0.7], '70%'],
//   [[0.21], '21%'],
//   [[0.063], '6.3%'],
//   [[0.0189], '1.89%'],
//   [[0.00564], '0.56%']
// ])
