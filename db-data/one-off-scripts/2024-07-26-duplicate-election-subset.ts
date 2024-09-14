// For `new-democratic-primary`, we want to script to copy:
// - current 136 encrypted votes (in `votes-pending` collection)
// - current trustees list
// - other fields relevant to decentralized shuffle + unlock

// - Other trustees, in their local storage, also need to copy their private keys to the new election_id
// See function `cloneTrusteeDetails` at bottom

import '../_env'

import { pick } from 'lodash'

import { firebase } from '../../pages/api/_services'

const election_id_from = '1721122924218'
const election_id_to = '1722029077573'

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
      if (doc.id === '79168f4563') console.log('Found doc 79168f4563!') // where did this 1 of 26 go?
      if (subcollectionName === 'votes-pending' && !subset_to_keep.includes(doc.id)) continue // skip votes not in has_good_passport_auth subset
      batch.set(targetSubcollection.doc(doc.id), doc.data())
      progress++
    }

    await batch.commit()

    console.log(`${subcollectionName}: ${progress}/${docs.length} - ${((progress / docs.length) * 100).toFixed(0)}%`)
  }

  console.log('Finished copy: ' + subcollectionName)
}

// eslint-disable-next-line no-extra-semi
;(async function main() {
  const db = firebase.firestore()
  const electionFromDoc = db.collection('elections').doc(election_id_from)
  const electionToDoc = db.collection('elections').doc(election_id_to)

  // Copy subcollections
  await copySubcollection(electionFromDoc, electionToDoc, 'votes-pending')
  await copySubcollection(electionFromDoc, electionToDoc, 'trustees')

  // Copy other relevant fields
  const fromElectionData = await electionFromDoc.get()
  const fieldsToCopy = pick(fromElectionData.data(), [
    'num_votes', // not strictly necessary but led to some graphical glitches
    'ballot_design', // for shuffle
    't', // for admin to know when to decrypt
    'threshold_public_key', // for shuffle
  ])
  await electionToDoc.update(fieldsToCopy)
})()

/** Clone localStorage trustee details
    Useful for making a subset of votes to shuffle separately from main election */
export function cloneTrusteeDetails(from_election_id, to_election_id) {
  let matches = 0
  Object.entries(localStorage).forEach(([key, value]) => {
    // Only care about from_election_id 'observer' entries
    if (!key.includes(`observer-${from_election_id}-`)) return

    // Update state.election_id field
    const state = JSON.parse(value)
    state.election_id = to_election_id

    // Update key with to_election_id
    const new_key = key.replace(from_election_id, to_election_id)

    // Save to localStorage
    localStorage.setItem(new_key, JSON.stringify(state))
    console.log(`${++matches}. Cloned ${key} to ${to_election_id}`)
  })

  if (!matches) return console.warn('No localStorage matches for from_election_id: ' + from_election_id)
}

// Just the subset of votes we verified have a good passport proof
const subset_to_keep = [
  '13ec850164',
  '159b08430a',
  '15ba012b15',
  '1669afb3d7',
  '18fa92d241',
  '1b73c6418b',
  '1be44cfdb4',
  '1fd1cb693a',
  '1fff356f52',
  '20b8a9fa94',
  '235fccb4ee',
  '251abba6e5',
  '27302f85e9',
  '2a8248e0d8',
  '2ad0de9383',
  '2d49c20201',
  '6758f7a2db',
  '71313c9066',
  '79168f4563',
  '8de58d0228',
  '91cba5ab38',
  '9d8190bd08',
  'a529c9cc2b',
  'a28873bdc4',
  'a5285a0ee8',
  'b16dfae0b1',
]
