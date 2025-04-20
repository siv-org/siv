import './_env'

import fs from 'fs'

import { firebase } from '../pages/api/_services'

// Run this to write existing Firebase collections to local JSON file

// Execute this file with:
// npx ts-node db-data/_dl-all.ts

type NestedDump = Record<string, unknown> & {
  __subcollections__?: Record<string, NestedDump>
}
const db = firebase.firestore()

async function getNestedDataForCollection(path: string): Promise<NestedDump> {
  const colRef = db.collection(path)
  const snapshot = await colRef.get()

  const result: NestedDump = {}

  for (const doc of snapshot.docs) {
    const docData: NestedDump = { ...doc.data() }

    const subcollections = await doc.ref.listCollections()
    if (subcollections.length > 0) {
      docData.__subcollections__ = {}
      for (const subcol of subcollections) {
        const subData = await getNestedDataForCollection(`${path}/${doc.id}/${subcol.id}`)
        docData.__subcollections__[subcol.id] = subData
      }
    }

    result[doc.id] = docData
  }

  return result
}

async function exportNestedFirestore() {
  const topLevelCollections = await db.listCollections()
  const dump: NestedDump = {}

  for (const col of topLevelCollections) {
    dump[col.id] = await getNestedDataForCollection(col.id)
    console.log(`Finished downloading: ${col.id}`)
  }

  fs.writeFileSync(`local-backup/${new Date().toISOString().slice(0, 16)}.json`, JSON.stringify(dump, null, 2))
  console.log('Export complete.')
}

exportNestedFirestore()
