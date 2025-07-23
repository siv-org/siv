// We have 137 "pending" votes (from link-auth). We want admin to begin unlocking them.
// So we need to move them from 'votes-pending' to 'votes

import '../_env'

import { firebase } from '../../pages/api/_services'

const election_id = '1722034716600' // NDP, Final, All 230 Votes

async function renameSubcollection(
  parentDoc: FirebaseFirestore.DocumentReference,
  oldSubcollectionName: string,
  newSubcollectionName: string,
) {
  console.log('Starting rename from ' + oldSubcollectionName + ' -> ' + newSubcollectionName)
  const sourceSubcollection = parentDoc.collection(oldSubcollectionName)
  const targetSubcollection = parentDoc.collection(newSubcollectionName)

  const allSourceDocs = await sourceSubcollection.get()
  const docs = allSourceDocs.docs
  const amount = docs.length
  let index = 0
  const intervalToReport = 10

  // for...of loop
  for (const doc of docs) {
    const data = doc.data()
    const auth = data.link_auth
    await targetSubcollection.doc(doc.id).set({ ...data, auth })
    const email = `${index + 1}@approved-by-script`
    parentDoc.collection('voters').doc(email).set({
      added_at: new Date(),
      auth_token: auth,
      email,
      index,
    })
    await doc.ref.delete()
    index++
    if (index % intervalToReport === 0) console.log(`${index}/${amount} - ${((index / amount) * 100).toFixed(0)}%`)
  }

  console.log('Finished rename from ' + oldSubcollectionName + ' -> ' + newSubcollectionName)
}

// eslint-disable-next-line no-extra-semi
;(async function main() {
  const db = firebase.firestore()
  const electionDoc = db.collection('elections').doc(election_id)

  await renameSubcollection(electionDoc, 'votes-pending', 'votes')
})()
