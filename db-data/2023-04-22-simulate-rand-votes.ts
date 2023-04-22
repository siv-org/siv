/*
The goal of this script is to create a large # of votes for stress testing.

Execute it w/:
    npx ts-node db-data/2023-04-22-simulate-rand-votes.ts
*/

import './_env'

import { mapValues } from 'lodash'

import { firebase } from '../pages/api/_services'
import { RP, random_bigint, stringToPoint } from '../src/crypto/curve'
import encrypt from '../src/crypto/encrypt'
import { CipherStrings } from '../src/crypto/stringify-shuffle'
import { generateTrackingNum } from '../src/vote/tracking-num'

const election_id = '1682159924547'

const ballot_design = [
  {
    id: 'Chair',
    options: [
      {
        name: 'Kassandra Hila',
        weight: 0.9,
      },
    ],
    write_in_allowed: false,
  },
  {
    id: 'Vice-Chair',
    options: [
      {
        name: 'Byron Rhudy',
        weight: 0.85,
      },
    ],
    write_in_allowed: false,
  },
  {
    id: 'Secretary',
    options: [
      {
        name: 'Nancy Risch',

        weight: 0.2,
      },
      {
        name: 'Elin Vitucci',
        weight: 0.4,
      },
      {
        name: 'Will Bilderback',

        weight: 0.26,
      },
    ],
    write_in_allowed: false,
  },
  {
    id: 'Treasurer',
    options: [
      {
        name: 'Tyler Goodall',

        weight: 0.4,
      },
      {
        name: 'Lilah Notti',

        weight: 0.56,
      },
    ],
    write_in_allowed: false,
  },
]

let pub_key: RP
type Vote = { Chair: CipherStrings; Secretary: CipherStrings; Treasurer: CipherStrings; 'Vice-Chair': CipherStrings }
const random_vote = () => {
  const verification = generateTrackingNum()
  let num_blank = 0
  return ballot_design.reduce((memo, { id, options }) => {
    const random = Math.random()
    let total_weights_so_far = 0
    const choice = options.find(({ weight }) => {
      total_weights_so_far += weight
      return random < total_weights_so_far
    })
    let plaintext = verification + ':BLANK'
    if (choice) {
      plaintext = verification + ':' + choice.name
    } else {
      // Don't allow a fully blank vote
      num_blank++
      if (num_blank === options.length) {
        const random_choice = options[Math.floor(Math.random() * options.length)]
        plaintext = verification + ':' + random_choice.name
      }
    }
    const encoded = stringToPoint(plaintext)
    const cipher = encrypt(pub_key, random_bigint(), encoded)
    memo[id] = mapValues(cipher, String)

    return memo
  }, {} as Vote)
}

const create_and_store_random_votes = async (voters: Voter[]) => {
  const db = firebase.firestore()
  const batch = db.batch()

  const electionDoc = db.collection('elections').doc(election_id)

  // Get all existing votes
  const votes = await electionDoc.collection('votes').get()
  const votesByAuth = votes.docs.reduce((memo, doc) => ({ ...memo, [memo[doc.data().auth]]: true }), {})

  voters.forEach(({ auth_token }) => {
    if (votesByAuth[auth_token]) return // Skip if already voted

    // Store the encrypted vote in db
    const voteDoc = electionDoc.collection('votes').doc()
    batch.set(voteDoc, { auth: auth_token, created_at: new Date(), encrypted_vote: random_vote() })
  })
  batch.update(electionDoc, { num_votes: voters.length })

  // Commit the batch write
  await batch.commit()
}

type Voter = { auth_token: string }
const getVoters = async (): Promise<Voter[]> => {
  const docs = await firebase.firestore().collection('elections').doc(election_id).collection('voters').get()

  return docs.docs.map((doc) => ({ ...(doc.data() as { auth_token: string }) }))
}

/** Load this election's pub key from the db */
const getPubkey = async (): Promise<RP> =>
  RP.fromHex((await firebase.firestore().collection('elections').doc(election_id).get()).data()?.threshold_public_key)

;(async () => {
  pub_key = await getPubkey()
  console.log(`Found pubkey ${pub_key}`)
  const voters = await getVoters()
  console.log(`Found ${voters.length} voters`)

  // Create votes
  await create_and_store_random_votes(voters)

  console.log('\nDone 👍')
})()
