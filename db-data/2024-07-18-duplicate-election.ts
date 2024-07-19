// For `new-democratic-primary`, we want to script to copy:
// - current 136 encrypted votes (in `votes-pending` collection)
// - current trustees list

// TODO: Other items we still needed to copy over:
// - election.threshold_public_key -> for shuffle
// - election.ballot_design -> for shuffle
// - other trustees, in their local storage, need to copy their private keys to the new election_id
//    - which involves both renaming the localStorage key, AND updating the value election_id inside the json blob, 2nd item.
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

  const snapshot = await sourceSubcollection.get()
  const docs = snapshot.docs
  const amount = docs.length
  let progress = 0
  const intervalToReport = 20

  for (const doc of docs) {
    await targetSubcollection.doc(doc.id).set(doc.data())
    progress++
    if (progress % intervalToReport === 0)
      console.log(`${subcollectionName}: ${progress}/${amount} - ${((progress / amount) * 100).toFixed(0)}%`)
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
