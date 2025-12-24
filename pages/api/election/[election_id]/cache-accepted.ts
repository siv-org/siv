import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const startTime = Date.now()
  let total_reads = 0

  // Lookup the election requested
  const { election_id } = req.query
  if (typeof election_id !== 'string') return res.status(400).json({ error: 'missing required election_id' })
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const election = await electionDoc.get()
  total_reads += 1
  if (!election.exists) return res.status(400).json({ error: 'Unknown Election ID.' })

  // Lookup the last cached time
  const lastCachedAt = election.data()?.votes_last_cached_at?.toDate() as Date | undefined
  let cachedVotes = []
  let cachedPendingVotes = []
  if (lastCachedAt) {
    const cachedDoc = await electionDoc.collection('votes-cached').doc('1').get()
    total_reads += 1
    cachedVotes = cachedDoc.data()?.votes || []
    cachedPendingVotes = cachedDoc.data()?.pendingVotes || []
  }

  // Load new votes & pending votes
  let votesQuery = electionDoc.collection('votes').orderBy('created_at')
  let pendingVotesQuery = electionDoc.collection('votes-pending').orderBy('created_at')
  if (lastCachedAt) {
    votesQuery = votesQuery.startAfter(lastCachedAt)
    pendingVotesQuery = pendingVotesQuery.startAfter(lastCachedAt)
  }
  const loadPendingVotes = pendingVotesQuery.get() // begin loading in parallel

  const freshVotes = (await votesQuery.get()).docs.map((doc) => {
    const { auth, encrypted_vote } = doc.data()
    return { auth, ...encrypted_vote }
  })
  total_reads += Math.max(freshVotes.length, 1)

  const freshPendingVotes = (await loadPendingVotes).docs.map((doc) => {
    const { encrypted_vote } = doc.data()
    return { auth: 'pending', ...encrypted_vote }
  })
  total_reads += Math.max(freshPendingVotes.length, 1)

  const pendingVotes = [...cachedPendingVotes, ...freshPendingVotes]
  const votes = [...cachedVotes, ...freshVotes]

  // If there are new votes or pending votes, cache them
  let total_writes = 0
  if (freshVotes.length || freshPendingVotes.length) {
    await electionDoc.collection('votes-cached').doc('1').set({
      cached_at: new Date(),
      pendingVotes,
      votes,
    })
    await electionDoc.update({ votes_last_cached_at: new Date() })
    total_writes += 2
  }

  return res.status(200).json({
    _stats: {
      __endpoint: {
        _name: '/cache-accepted',
        duration: `${Date.now() - startTime}ms`,
        now: new Date().toLocaleString(),
      },
      _last_cached_at: lastCachedAt?.toLocaleString() || null,
      pendingVotes: { cached: cachedPendingVotes.length, fresh: freshPendingVotes.length },
      votes: { cached: cachedVotes.length, fresh: freshVotes.length },
      z_total_reads: total_reads,
      z_total_writes: total_writes,
    },
    results: [...votes, ...pendingVotes],
  })
}
