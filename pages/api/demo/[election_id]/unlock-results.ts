import type { State } from 'src/vote/vote-state'

import { firebase } from 'api/_services'
import { createHash } from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'
import { fastShuffle } from 'src/crypto/shuffle'
import { sharedDemoMethod } from 'src/demo/interactiveDemo/content'
import { generateColumnNames } from 'src/vote/generateColumnNames'

import { decryptColumn } from '../../election/[election_id]/admin/decrypt-column'
import { recombine_decrypteds } from '../../election/[election_id]/admin/unlock'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Validate the request and restrict it to the shared demo elections.
  if (req.method !== 'POST') return res.setHeader('Allow', 'POST').status(405).json({ error: 'Use POST.' })
  const { election_id } = req.query
  if (typeof election_id !== 'string' || !sharedDemoMethod(election_id))
    return res.status(400).json({ error: 'Unknown shared demo election.' })
  const { ADMIN_EMAIL } = process.env
  if (!ADMIN_EMAIL) return res.status(501).json({ error: 'Missing process.env.ADMIN_EMAIL' })

  // Look up the election and its server-held decryption key.
  const db = firebase.firestore()
  const election = db.collection('elections').doc(election_id)
  const key = election.collection('trustees').doc(ADMIN_EMAIL)
  const [snapshot, keySnapshot] = await Promise.all([election.get(), key.get()])
  const data = snapshot.data()
  const privateKey = keySnapshot.data()
  if (!data?.is_demo || !privateKey?.private_keyshare)
    return res.status(404).json({ error: 'Unknown shared demo election.' })

  // Load the current votes and check whether the published snapshot can be reused.
  // TODO (demo-only, non-blocking): Each refresh currently reads every vote, even if results are unchanged.
  // Later, track vote revisions and the last processed revision to read only new/replaced votes,
  // retaining everyone's results. Update revisions atomically with votes, keep replacement mappings
  // server-only, and guard concurrent result updates so changes cannot be skipped or counted twice.
  const votes = await election.collection('votes').get()
  // Compare ciphertexts, not counts: receipt replacement does not add a vote.
  // ponytail: Hash stored objects directly; a key-order change only causes a harmless extra refresh.
  const fingerprint = createHash('sha256')
    .update(JSON.stringify(votes.docs.map((doc) => doc.data().encrypted_vote)))
    .digest('hex')
  if (data.demo_results_fingerprint !== fingerprint) {
    // Unlock votes again
    const { columns } = generateColumnNames({ ballot_design: JSON.parse(data.ballot_design) })
    const decrypted = await unlockDemoBallots(
      privateKey.private_keyshare,
      votes.docs.map((doc) => doc.data().encrypted_vote as State['encrypted']),
      columns,
      election_id,
    )

    // Publish the snapshot
    // Note: Last write wins... a race condition could mean a slow older snapshot could overwrite a newer one, & persist until the next unlock
    // ponytail: Use SIV's single-document results format; partition snapshots before Firestore's 1 MiB limit.
    await election.update({ decrypted, demo_results_fingerprint: fingerprint, last_decrypted_at: new Date() })
  }

  // Return the normal SIV results page for the demo to display.
  return res.status(200).json({ status: 'success' })
}

export async function unlockDemoBallots(
  secret: string,
  votes: State['encrypted'][],
  columns: string[],
  election_id?: string,
) {
  const decrypted = Object.fromEntries(
    columns.map((column) => [column, decryptColumn(fastShuffle(votes.map((vote) => vote[column])), secret)]),
  )
  const rows = await recombine_decrypteds(decrypted, election_id)
  return Object.values(rows).sort((a, b) => a.tracking.localeCompare(b.tracking))
}
