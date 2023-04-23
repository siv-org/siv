// Execute this file with:
// npx ts-node db-data/2023-04-22-get-ballot-design-columns.ts

import './_env'

import { firebase } from '../pages/api/_services'

// CHANGE ME 👇
const admin_email = ''
const min_votes = 0

// Find all elections created by them
;(async () => {
  const elections = (
    await firebase
      .firestore()
      .collection('elections')
      .where('creator', '==', admin_email)
      .orderBy('created_at', 'desc')
      .get()
  ).docs

  console.log('Current time:', new Date().toLocaleString())
  console.log(`Found ${elections.length} elections\n`)

  if (min_votes > 0) console.log('Filtering for at least', min_votes, 'votes cast:')

  let total = 0

  elections.slice(0, 17).forEach((election, n) => {
    const data = election.data()
    const { ballot_design, decrypted = [], election_title, num_voters, num_votes } = data
    if (num_votes < min_votes) return

    const numCols = JSON.parse(ballot_design || []).length
    total += num_votes * numCols

    console.log(
      `${n + 1}. ${election_title}: ${num_voters} voters x ${numCols} col — ${num_votes} votes, ${
        decrypted.length
      } unlocked`,
    )
  })

  console.log('\nTotal selections cast:', total)
})()
