import './_env'

import fs from 'fs'
import path from 'path'

import bluebird from 'bluebird'
import { firestore } from 'firebase-admin'

import { firebase } from '../pages/api/_services'

// import elections from './elections.json'

// Run this to write existing Firebase collections to local JSON files

// Execute this file with:
// npx ts-node db-data/_dl-all.ts

// Download all Firebase data to JSON files
type DirectionStr = 'desc' | 'asc'
type Collection = [string, Collection[]?, string?, DirectionStr?]
const collectionsToDownload: Collection[] = [['elections', [['votes', [], 'created_at', 'desc']], 'created_at', 'desc']]

bluebird.mapSeries(collectionsToDownload, async ([collection, subcollections, orderKey, direction]: Collection) => {
  console.log(`  ⬇️ Downloading ${collection}...`)

  let query: firestore.Query = firebase.firestore().collection(collection)

  // Apply optional orderBy()
  if (orderKey) query = query.orderBy(orderKey, direction)

  const data = (await query.get()).docs.map((doc) => ({ id: doc.id, ...doc.data() }))

  fs.writeFileSync(path.join(__dirname, `/${collection}.json`), JSON.stringify(data))
  console.log(`  ✅ Wrote ${data.length} rows to ${collection}.json\n`)

  // const data = elections

  if (subcollections?.length) {
    await bluebird.mapSeries(subcollections, async ([sub, , suborder, subdirection]) => {
      console.log(`  ⬇️  Downloading sub ${sub}...`)

      let sublength = 0

      const subData = await bluebird.reduce(
        data,
        async (memo, row) => {
          let query: firestore.Query = firebase.firestore().collection(collection).doc(row.id).collection(sub)

          // Apply optional orderBy()
          if (suborder) query = query.orderBy(suborder, subdirection)

          memo[row.id] = (await query.get()).docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          sublength += memo[row.id].length

          return memo
        },
        {} as Record<string, unknown[]>,
      )

      const filename = `${collection}-${sub}.json`
      fs.writeFileSync(path.join(__dirname, `/${filename}`), JSON.stringify(subData))
      console.log(`  ✅ Wrote ${sublength} rows to ${filename}\n`)
    })
  }
})
