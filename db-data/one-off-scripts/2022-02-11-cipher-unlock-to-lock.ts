// Execute this file with:
// npx ts-node db-data/2022-02-11-cipher-unlock-to-lock.ts

import '../_env'

import bluebird from 'bluebird'

import { firebase } from '../../pages/api/_services'
import electionVotes from './elections-votes.json'

let found = 0

type ElectionVotes = Record<
  string,
  { encrypted_vote?: Record<string, { encrypted: string; lock?: string; unlock?: string }>; id: string }[]
>
;(async () => {
  // Iterate through all elections
  await bluebird.mapSeries(Object.keys(electionVotes), async (electionId) => {
    const votes = (electionVotes as ElectionVotes)[electionId]

    // Look through votes
    await bluebird.mapSeries(votes, async (vote) => {
      const { encrypted_vote } = vote

      let needsUpdate = false
      type Update = Record<string, { encrypted: string; lock?: string }>
      let newEncryptedVote

      if (encrypted_vote) {
        newEncryptedVote = Object.keys(encrypted_vote).reduce((memo, key) => {
          const col = encrypted_vote[key]
          if (col.unlock) {
            needsUpdate = true
          }

          memo[key] = { encrypted: col.encrypted, lock: col.lock || col.unlock }
          return memo
        }, {} as Update)
      }

      if (needsUpdate) {
        found++
        console.log(electionId, vote.id, newEncryptedVote)

        await firebase
          .firestore()
          .doc(`elections/${electionId}/votes/${vote.id}`)
          .update({ encrypted_vote: newEncryptedVote })
      }
    })
  })

  console.log(`Updated ${found}`)
})()
