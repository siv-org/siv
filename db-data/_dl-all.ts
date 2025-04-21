import './_env'

import fs from 'fs'
import path from 'path'

import { firebase } from '../pages/api/_services'

// Run this to write existing Firebase collections to local JSON file

// Execute this file with:
// npx tsx db-data/_dl-all.ts

type NestedDump = Record<string, unknown> & {
  __subcollections__?: Record<string, NestedDump>
}
const db = firebase.firestore()

async function getNestedDataForCollection(path: string): Promise<NestedDump> {
  const colRef = db.collection(path)
  // TODO: We might want to grab length of collection w/ a much faster count query
  // to get the size much faster, to print the expected size *before* doing the big .get() download.
  const snapshot = await colRef.get()
  console.log(`Processing ${path}: ${snapshot.docs.length} documents`)

  const result: NestedDump = {}

  for (const [index, doc] of snapshot.docs.entries()) {
    // Log progress every 100 documents
    if (index > 0 && index % 100 === 0) console.log(`  Progress: ${index}/${snapshot.docs.length} documents`)

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
  // Create backup directory with timestamp
  const timestamp = new Date().toISOString().slice(0, 16)
  const backupDir = path.join(__dirname, 'local-backup', timestamp)
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true })
  console.log(`Writing to ${backupDir}/`)

  const topLevelCollections = await db.listCollections()

  // Track collections in a manifest file
  const manifest = {
    collections: {} as Record<string, { error?: string; status: 'pending' | 'complete' | 'error' }>,
    timestamp,
  }
  for (const col of topLevelCollections) {
    manifest.collections[col.id] = { status: 'pending' }
  }
  fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
  console.log(`Found ${topLevelCollections.length} top-level collections. (see /manifest.json)`)

  // Download each top-level collection and its subcollections
  for (const col of topLevelCollections) {
    const collectionStart = Date.now()
    console.log(`\nStarting collection: ${col.id}`)

    try {
      // Check if we already have this collection
      const collectionFile = path.join(backupDir, `${col.id}.json`)
      // TODO: This check for existing data will only work if the timestamp is the same minute as the previous run.
      //       A much larger range is probably fine, at least for 99% of the data which is years old.
      //       For now, at least the script should write the data fine.
      //       We can improve this skipping logic when continuing from a partial download is needed.
      if (fs.existsSync(collectionFile)) {
        console.log(`Skipping ${col.id} - already downloaded`)
        continue
      }

      const data = await getNestedDataForCollection(col.id)

      // Write collection to its own file
      fs.writeFileSync(collectionFile, JSON.stringify(data, null, 2))

      // Update manifest
      manifest.collections[col.id].status = 'complete'
      fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2))

      const duration = (Date.now() - collectionStart) / 1000
      console.log(`Finished ${col.id} in ${duration.toFixed(1)}s`)
    } catch (error) {
      console.error(`Error processing ${col.id}:`, error)
      manifest.collections[col.id].status = 'error'
      manifest.collections[col.id].error = error instanceof Error ? error.message : String(error)
      fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
    }
  }

  // Create index.ts file with static imports
  console.log('\nCreating index file...')
  const completedCollections = Object.entries(manifest.collections)
    .filter(([, status]) => status.status === 'complete')
    .map(([id]) => id)

  const indexContent = `// Auto-generated index file for Firestore backup from ${timestamp}
${completedCollections.map((id) => `export { default as ${id} } from './${id}.json'`).join('\n')}

export type Collections = {
  ${completedCollections.map((id) => `${id}: typeof ${id}`).join(',\n  ')}
}
`

  fs.writeFileSync(path.join(backupDir, 'index.ts'), indexContent)
  console.log('Export complete!')
  console.log(`Backup files written to: ${backupDir}/`)
  console.log('Import from index.ts to access the collections statically')
}

exportNestedFirestore()
