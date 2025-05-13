import fs from 'fs'
import path from 'path'

import { firebase } from '../../pages/api/_services'

// Types and Firestore collection
type MigrationStatus = 'pending' | 'started' | 'completed' | 'failed'

type MigrationRecord = {
  completed_at?: { _seconds: number }
  error?: string
  id: string
  started_at?: { _seconds: number }
  status: MigrationStatus
}

const migrationsCollection = firebase.firestore().collection('migrations')

// Migration tracking functions
async function getMigrationStatus(migrationId: string): Promise<MigrationRecord | null> {
  const doc = await migrationsCollection.doc(migrationId).get()
  return doc.exists ? (doc.data() as MigrationRecord) : null
}

async function markMigrationStarted(migrationId: string): Promise<void> {
  await migrationsCollection.doc(migrationId).set({
    id: migrationId,
    started_at: { _seconds: Math.floor(Date.now() / 1000) },
    status: 'started',
  })
}

async function markMigrationCompleted(migrationId: string): Promise<void> {
  await migrationsCollection.doc(migrationId).update({
    completed_at: { _seconds: Math.floor(Date.now() / 1000) },
    status: 'completed',
  })
}

async function markMigrationFailed(migrationId: string, error: string): Promise<void> {
  await migrationsCollection.doc(migrationId).update({
    completed_at: { _seconds: Math.floor(Date.now() / 1000) },
    error,
    status: 'failed',
  })
}

// Migration script type and loading
type MigrationScript = {
  id: string
  path: string
  run: () => Promise<void>
}

async function loadLocalMigrationScripts(): Promise<MigrationScript[]> {
  const migrationsDir = path.join(__dirname)
  const files = fs.readdirSync(migrationsDir)

  return files
    .filter((file) => file.endsWith('.ts') && !file.startsWith('_'))
    .map((file) => {
      const id = file.replace('.ts', '')
      const scriptPath = path.join(migrationsDir, file)
      return {
        id,
        path: scriptPath,
        run: async () => {
          // Import the script dynamically
          const script = await import(scriptPath)
          if (typeof script.main !== 'function')
            throw new Error(`Migration script ${file} does not export a main function`)

          return script.main()
        },
      }
    })
}

async function runMigration(script: MigrationScript): Promise<void> {
  const existingMigration = await getMigrationStatus(script.id)
  if (existingMigration?.status === 'completed') return console.log(`Migration ${script.id} has already been completed`)
  if (existingMigration?.status === 'started') return console.log(`Migration ${script.id} is currently running`)

  try {
    await markMigrationStarted(script.id)
    console.log(`Starting migration: ${script.id}`)

    await script.run()

    await markMigrationCompleted(script.id)
    console.log(`Completed migration: ${script.id}`)
  } catch (error) {
    console.error(`Migration ${script.id} failed:`, error)
    await markMigrationFailed(script.id, error instanceof Error ? error.message : String(error))
    throw error // Re-throw to stop further migrations
  }
}

export async function runAllMigrations(): Promise<void> {
  const scripts = await loadLocalMigrationScripts()
  console.log(`Found ${scripts.length} migration scripts`)

  for (const script of scripts) {
    await runMigration(script)
  }
}

// If this file is run directly
if (require.main === module) {
  runAllMigrations().catch((error) => {
    console.error('Migration runner failed:', error)
    process.exit(1)
  })
}
