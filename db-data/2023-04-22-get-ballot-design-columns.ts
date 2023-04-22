// Execute this file with:
// npx ts-node db-data/2023-04-22-get-ballot-design-columns.ts

import './_env'

import { firebase } from '../pages/api/_services'

// CHANGE ME 👇
const admin_email = ''

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

  console.log(`Found ${elections.length} elections\n`)

  elections.forEach((election, n) => {
    const data = election.data()
    const { ballot_design, election_title, num_voters, num_votes } = data
    const numCols = JSON.parse(ballot_design || []).length

    console.log(`${n + 1}. ${election_title}: ${num_voters} voters x ${numCols} col — ${num_votes} votes`)
  })
})()
