/*
The goal of this script is to simulate voters casting votes in our demo video election.

Execute it w/:
    npx ts-node db-data/2022-02-12-demo-vid-voters.ts
*/

import './_env'

import { mapValues, range } from 'lodash'
import fetch from 'node-fetch' // Replaced in node 17.5 w/ experimental native fetch

import { firebase } from '../pages/api/_services'
import { RP, random_bigint, stringToPoint } from '../src/crypto/curve'
import encrypt from '../src/crypto/encrypt'
import { CipherStrings } from '../src/crypto/stringify-shuffle'
import { generateTrackingNum } from '../src/vote/tracking-num'

const election_id = '1645244736891'
const first_voter = 2
const last_voter = 10

const api = (route: string, body?: Record<string, unknown>) =>
  fetch(`http://localhost:3000/api/${route}`, {
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

const ballot_design = [
  {
    id: 'mayor',
    options: [
      {
        name: 'Kassandra Hila',
        weight: 0.08,
      },
      {
        name: 'Byron Rhudy',
        weight: 0.18,
      },
      {
        name: 'Nancy Risch',
        weight: 0.31,
      },
      {
        name: 'Elin Vitucci',
        weight: 0.37,
      },
    ],
    title: 'Who should be elected our next mayor of Greeley?',
    write_in_allowed: false,
  },
  {
    id: 'us_house_rep',
    options: [
      {
        name: 'Will Bilderback',
        sub: '(No Party Preference)',
        weight: 0.47,
      },
      {
        name: 'Tyler Goodall',
        sub: '(Justice Party)',
        weight: 0.2,
      },
      {
        name: 'Lilah Notti',
        sub: '(Liberty Party)',
        weight: 0.28,
      },
    ],
    title: 'Who should be elected our next US House Representative?',
    write_in_allowed: false,
  },
]
let pub_key: RP
type Vote = { mayor: CipherStrings; us_house_rep: CipherStrings }
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
const submit_random_encrypted_vote = async (auth_token: string) => {
  const response = await api('submit-vote', { auth: auth_token, election_id, encrypted_vote: random_vote() })
  if (response.status !== 200) {
    const { error } = (await response.json()) as { error: string }
    throw error
  }
}

type Voter = { auth_token: string; email: string }
const getVoters = async (): Promise<Voter[]> =>
  Promise.all(
    range(first_voter, last_voter + 1).map(
      async (x) =>
        ({
          ...(
            await firebase
              .firestore()
              .collection('elections')
              .doc(election_id)
              .collection('voters')
              .doc(`demo-voter-${x}@siv.org`)
              .get()
          ).data(),
        } as Voter),
    ),
  )
// const getVoters = () => range(200).map((n) => ({ auth_token: '', email: `demo-voter-${n}@siv.org` }))

/** Load this election's pub key from the db */
const getPubkey = async (): Promise<RP> =>
  RP.fromHex((await firebase.firestore().collection('elections').doc(election_id).get()).data().threshold_public_key)

;(async () => {
  pub_key = await getPubkey()
  console.log(`Found pubkey ${pub_key}`)
  const voters = await getVoters()
  console.log(`Found ${voters.length} voters`)

  // Only simulate for the demo voters
  await Promise.all(
    voters.map(async ({ auth_token, email }) => {
      await submit_random_encrypted_vote(auth_token)
      console.log({ auth_token, email, submitted: true })
    }),
  )

  console.log('\nDone 👍')
})()
