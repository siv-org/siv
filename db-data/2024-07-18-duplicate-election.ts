// For `new-democratic-primary`, we want to script to copy:
// - current 136 encrypted votes (in `votes-pending` collection)
// - current trustees list

// - Other trustees, in their local storage, need to copy their private keys to the new election_id
// See function `cloneTrusteeDetails` at bottom

// TODO: Other items we still needed to copy over:
// - election.threshold_public_key -> for shuffle
// - election.ballot_design -> for shuffle
// - num_votes (not strictly necessary but led to some graphical glitches)
// election.t > needed for admin to know when to decrypt

import './_env'

import { firebase } from '../pages/api/_services'

const election_id_from = '1721122924218'
const election_id_to = '1721314324882'

async function copySubcollection(
  sourceDoc: FirebaseFirestore.DocumentReference,
  targetDoc: FirebaseFirestore.DocumentReference,
  subcollectionName: string,
) {
  console.log('Starting copy: ' + subcollectionName)
  const sourceSubcollection = sourceDoc.collection(subcollectionName)
  const targetSubcollection = targetDoc.collection(subcollectionName)

  const { docs } = await sourceSubcollection.get()
  let progress = 0

  // Use firestore batched writes
  const batchLimit = 500 // max operations per batch
  for (let i = 0; i < docs.length; i += batchLimit) {
    const batch: FirebaseFirestore.WriteBatch = sourceDoc.firestore.batch()

    const batchDocs = docs.slice(i, i + batchLimit)
    for (const doc of batchDocs) {
      batch.set(targetSubcollection.doc(doc.id), doc.data())
    }

    await batch.commit()
    progress += batchDocs.length

    console.log(`${subcollectionName}: ${progress}/${docs.length} - ${((progress / docs.length) * 100).toFixed(0)}%`)
  }

  console.log('Finished copy: ' + subcollectionName)
}

// eslint-disable-next-line no-extra-semi
;(async function main() {
  const db = firebase.firestore()
  const electionFromDoc = db.collection('elections').doc(election_id_from)
  const electionToDoc = db.collection('elections').doc(election_id_to)

  await copySubcollection(electionFromDoc, electionToDoc, 'votes-pending')
  await copySubcollection(electionFromDoc, electionToDoc, 'trustees')
})()

/** Clone localStorage trustee details from from old_election_id to new_election_id.
    Useful for making a subset of votes to shuffle separately from main election */
export function cloneTrusteeDetails(old_election_id, new_election_id) {
  let matches = 0
  Object.entries(localStorage).forEach(([key, value]) => {
    // Only care about old_election_id 'observer' entries
    if (!key.includes(`observer-${old_election_id}-`)) return

    // Update state.election_id field
    const state = JSON.parse(value)
    state.election_id = new_election_id

    // Update key with new_election_id
    const new_key = key.replace(old_election_id, new_election_id)

    // Save to localStorage
    localStorage.setItem(new_key, JSON.stringify(state))
    console.log(`${++matches}. Cloned ${key} to ${new_election_id}`)
  })

  if (!matches) return console.warn('No localStorage matches for old_election_id: ' + old_election_id)
}
