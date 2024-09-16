import '../_env'

import { firebase } from '../../pages/api/_services'

/*
Merge old DB `voters` & `votes` collections into `approved-voters` collection

## Goals of this script:
(context: https://github.com/siv-org/siv/pull/152#issuecomment-2212417637)

1. Make voters be indexed by auth token, instead of by email.
     - Avoids collisions on email (eg after invalidation). Avoid needing emails at all (eg sms auth, qr codes)
     - Will want to warn about duplicate emails, but shouldn't strictly be a blocker

2. And to merge votes collection into voters
3. And to rename that collection to approved-voters

## How it will work:

Loop through every election
    START DB TRANSACTION
        Download all voters
        Download all votes
        Write existing voters + votes combined to new `approved-voters` collection

        Delete all old 'votes' and 'voters' documents
    END DB TRANSACTION
*/

const election_ids = ['1726520050751']

type Vote = {
  auth: string
  created_at: { _seconds: number }
}
type Voter = {
  auth_token: string
}
type ApprovedVoter = Voter & Partial<Vote & { voted_at: { _seconds: number } }>

async function main() {
  const db = firebase.firestore()

  for (const election_id of election_ids) {
    console.log('Running merge migration for election_id:', election_id)
    const electionDoc = db.collection('elections').doc(election_id)

    try {
      await db.runTransaction(async (transaction) => {
        const votersRef = electionDoc.collection('voters')
        const votesRef = electionDoc.collection('votes')

        const votersSnapshot = await transaction.get(votersRef)
        // Fine to skip if no voters, but should print that it's skipping
        const votesSnapshot = await transaction.get(votesRef)
        // TODO: Shouldn't fail if no votes

        const approvedVoters: ApprovedVoter[] = []

        // First we need to create an votesByAuth map
        const votesByAuth = votesSnapshot.docs.reduce(
          (memo, doc) => ({ ...memo, [doc.data().auth]: doc.data() as Vote }),
          {},
        )

        votersSnapshot.docs.forEach((voterDoc) => {
          const voterData = voterDoc.data() as Voter
          let voteData: Record<string, never> | Partial<Vote & { voted_at: { _seconds: number } }> = {}
          if (votesByAuth[voterData.auth_token]) {
            voteData = votesByAuth[voterData.auth_token]
            voteData.voted_at = voteData.created_at
            delete voteData.created_at
            delete voteData.auth
          }

          approvedVoters.push({ ...voterData, ...voteData })
        })

        const approvedVotersRef = electionDoc.collection('approved-voters')

        // Write combined data to new collection
        approvedVoters.forEach((av) => {
          transaction.set(approvedVotersRef.doc(av.auth_token), av)
        })

        // Delete old collections
        // votersSnapshot.docs.forEach((voterDoc) => {
        //   transaction.delete(votersRef.doc(voterDoc.id))
        // })

        // votesSnapshot.docs.forEach((voteDoc) => {
        //   transaction.delete(votesRef.doc(voteDoc.id))
        // })
      })

      console.log('Migration completed for election:', election_id)
    } catch (error) {
      console.error('Failed to complete migration for election:', election_id, error)
    }
  }
}

main()
