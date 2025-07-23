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

const CHUNK_SIZE = 50 // Process this many documents in parallel

async function getNestedDataForCollection(path: string, writeStream?: fs.WriteStream): Promise<NestedDump> {
  const colRef = db.collection(path)
  // TODO: We might want to grab length of collection w/ a much faster count query
  // to get the size much faster, to print the expected size *before* doing the big .get() download.
  const snapshot = await colRef.get()
  console.log(`Found ${path}: ${snapshot.docs.length} documents`)

  const result: NestedDump = {}

  // Top-level collections get writeStreams, subcollections don't.
  if (writeStream) writeStream.write('export default {\n')

  // Process documents in chunks for parallel processing
  for (let i = 0; i < snapshot.docs.length; i += CHUNK_SIZE) {
    const chunk = snapshot.docs.slice(i, i + CHUNK_SIZE)

    // Process each document in the chunk in parallel
    await Promise.all(
      chunk.map(async (doc) => {
        const docData: NestedDump = { ...doc.data() }

        const subcollections = await doc.ref.listCollections()
        if (subcollections.length > 0) {
          docData.__subcollections__ = {}
          // Process subcollections sequentially to avoid too many concurrent requests
          for (const subcol of subcollections) {
            docData.__subcollections__[subcol.id] = await getNestedDataForCollection(`${path}/${doc.id}/${subcol.id}`)
          }
        }

        if (writeStream) writeStream.write(`  "${doc.id}": ${JSON.stringify(docData, null, 2)},\n`)

        result[doc.id] = docData
      }),
    )

    // Log progress after each chunk
    console.log(`  Progress: ${Math.min(i + CHUNK_SIZE, snapshot.docs.length)}/${snapshot.docs.length} documents`)
  }

  if (writeStream) writeStream.write('}\n')

  return result
}

async function exportNestedFirestore() {
  const timestamp = new Date().toISOString().slice(0, 16)
  const backupDir = path.join(__dirname, 'local-backup', timestamp)
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true })
  console.log(`Writing to ${backupDir}/`)

  const topLevelCollections = await db.listCollections()
  console.log(`Found ${topLevelCollections.length} top-level collections`)

  const manifest = {
    collections: {} as Record<string, { error?: string; status: 'pending' | 'complete' | 'error' }>,
    timestamp,
  }

  // Process collections sequentially
  for (const col of topLevelCollections) {
    const collectionStart = Date.now()
    manifest.collections[col.id] = { status: 'pending' }
    console.log(`\n🟢 Starting collection: ${col.id}`)

    try {
      const collectionFile = path.join(backupDir, `${col.id}.js`)
      // TODO: This check for existing data will only work if the timestamp is the same minute as the previous run.
      //       A much larger range is probably fine, at least for 99% of the data which is years old.
      //       For now, at least the script should write the data fine.
      //       We can improve this skipping logic when continuing from a partial download is needed.
      if (fs.existsSync(collectionFile)) {
        console.log(`Skipping ${col.id} - already downloaded`)
        manifest.collections[col.id].status = 'complete'
        continue
      }

      const writeStream = fs.createWriteStream(collectionFile)
      await getNestedDataForCollection(col.id, writeStream)

      manifest.collections[col.id].status = 'complete'
      const duration = (Date.now() - collectionStart) / 1000
      console.log(`Finished ${col.id} in ${duration.toFixed(1)}s 🕑`)
    } catch (error) {
      console.error(`Error processing ${col.id}:`, error)
      manifest.collections[col.id].status = 'error'
      manifest.collections[col.id].error = error instanceof Error ? error.message : String(error)
    }

    // Write manifest after each collection
    fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
  }

  // Create index.ts file with static imports
  console.log('\nCreating index file...')
  const completedCollections = Object.entries(manifest.collections)
    .filter(([, status]) => status.status === 'complete')
    .map(([id]) => id)

  const indexContent = `// Auto-generated index file for Firestore backup from ${timestamp}
${completedCollections.map((id) => `export { default as ${id.replaceAll('-', '_')} } from './${id}.js'`).join('\n')}
`

  fs.writeFileSync(path.join(backupDir, 'index.ts'), indexContent)
  console.log('Export complete!')
  console.log(`Backup files written to: ${backupDir}/`)
  console.log('Import from index.ts to access the collections statically')
}

exportNestedFirestore()
