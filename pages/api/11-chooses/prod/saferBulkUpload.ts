import throat from 'throat'

import { writeWithRetry } from './writeWithRetry'
const limit = throat(50)

import { firestore } from 'firebase-admin'

import { voterFileToUploadFormat } from '../upload-voters-test'

export async function saferBulkUpload(
  {
    electionDoc,
    importBatchId,
    new_voter_uploads,
    prev_num_uploaded,
  }: {
    electionDoc: firestore.DocumentReference
    importBatchId: string
    new_voter_uploads: ReturnType<typeof voterFileToUploadFormat>[]
    prev_num_uploaded: number
  },
  response: { failed: (error: unknown) => void; success: (message: unknown) => void },
) {
  const failures: Array<{ email: string; error: unknown }> = []

  const voterWrites = new_voter_uploads.map((v: ReturnType<typeof voterFileToUploadFormat>, index: number) =>
    limit(async () => {
      const email = `${index + prev_num_uploaded}${v.voter_file.is_withheld ? 'withheld' : ''}@${importBatchId}`
      const docRef = electionDoc.collection('voters').doc(email)

      const payload = {
        ...v,
        added_at: new Date(),
        email,
        importBatchId,
        index: index + prev_num_uploaded,
      }

      try {
        await writeWithRetry(docRef, payload)
      } catch (error) {
        failures.push({ email, error })
        // optionally log immediately
        console.error('Failed to write voter', { email, error })
      }
    }),
  )

  await Promise.all([
    ...voterWrites,
    electionDoc.update({
      last_import_batch_id: importBatchId,
      num_voters: firestore.FieldValue.increment(new_voter_uploads.length),
    }),
  ])

  console.log('Upload complete, failures:', failures.length)

  if (failures.length) {
    // up to you: write failures to disk, another collection, or return them
    return response.failed({
      failures_count: failures.length,
      message: 'Completed with failures',
      success_count: new_voter_uploads.length - failures.length,
    })
  }

  return response.success({
    count: new_voter_uploads.length,
    importBatchId,
    message: 'Success',
    timestamp: new Date().toISOString(),
  })
}
