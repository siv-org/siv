/*
The goal of this script is to create a large # of votes for stress testing.

Execute it w/:
    npx ts-node db-data/2023-04-22-simulate-rand-votes.ts
*/

import '../_env'

import { mapValues } from 'lodash'

import { firebase } from '../../pages/api/_services'
import { RP, random_bigint, stringToPoint } from '../../src/crypto/curve'
import encrypt from '../../src/crypto/encrypt'
import { CipherStrings } from '../../src/crypto/stringify-shuffle'
import { generateTrackingNum } from '../../src/vote/tracking-num'

const election_id = '1682168554981'

let pub_key: RP
let ballot_design: { id: string; options: { name: string }[] }[]
type Vote = { Chair: CipherStrings; Secretary: CipherStrings; Treasurer: CipherStrings; 'Vice-Chair': CipherStrings }
const random_vote = () => {
  const verification = generateTrackingNum()
  let num_blank = 0
  return ballot_design.reduce((memo, { id, options }) => {
    const choice = options[Math.floor(Math.random() * (options.length + 1))]?.name || 'BLANK'
    let plaintext = verification + ':' + choice

    // Don't allow a fully blank vote
    if (choice === 'BLANK') {
      num_blank++
      if (num_blank === options.length)
        plaintext = verification + ':' + options[Math.floor(Math.random() * options.length)].name
    }
    const encoded = stringToPoint(plaintext.slice(0, 30))
    const cipher = encrypt(pub_key, random_bigint(), encoded)
    memo[id] = mapValues(cipher, String)

    return memo
  }, {} as Vote)
}

const create_and_store_random_votes = async (voters: Voter[]) => {
  const db = firebase.firestore()

  const electionDoc = db.collection('elections').doc(election_id)

  // Get all existing votes
  const votes = await electionDoc.collection('votes').get()
  console.log(`Found ${votes.docs.length} existing votes`)
  const votesByAuth = votes.docs.reduce((memo, doc) => ({ ...memo, [doc.data().auth]: true }), {})

  // Firebase batches have size limits
  const maxBatchSize = 500
  const numBatches = Math.ceil((voters.length + 1) / maxBatchSize)
  const batches = Array(numBatches)
    .fill(0)
    .map(() => db.batch())

  voters.forEach(({ auth_token }, index) => {
    if (votesByAuth[auth_token]) return // Skip if voted already

    // Store the encrypted vote in db
    const voteDoc = electionDoc.collection('votes').doc()
    const batchIndex = Math.floor(index / maxBatchSize)
    batches[batchIndex].set(voteDoc, { auth: auth_token, created_at: new Date(), encrypted_vote: random_vote() })
  })

  // Update the electionDoc in the last batch
  batches[batches.length - 1].update(electionDoc, { num_votes: voters.length })

  // Commit all batches
  await Promise.all(batches.map((batch) => batch.commit()))
}

type Voter = { auth_token: string }
const getVoters = async (): Promise<Voter[]> => {
  const docs = await firebase.firestore().collection('elections').doc(election_id).collection('voters').get()

  return docs.docs.map((doc) => ({ ...(doc.data() as { auth_token: string }) }))
}

/** Load this election's pub key from the db */
const getPubkeyAndBallotDesign = async () => {
  const data = (await firebase.firestore().collection('elections').doc(election_id).get()).data()
  pub_key = RP.fromHex(data?.threshold_public_key)
  console.log(`Found pubkey ${pub_key}`)

  ballot_design = JSON.parse(data?.ballot_design)
  console.log(`Found ballot: ${ballot_design.map((col) => col.id)}`)
}

;(async () => {
  await getPubkeyAndBallotDesign()

  const voters = await getVoters()
  console.log(`Found ${voters.length} voters`)

  // Create votes
  await create_and_store_random_votes(voters)

  console.log('\nDone 👍')
})()
