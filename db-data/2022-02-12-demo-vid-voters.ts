/*
The goal of this script is to simulate voters casting votes in our demo video election.

Execute it w/:
    npx ts-node db-data/2022-02-12-demo-vid-voters.ts
*/

import './_env'

import { mapValues, round } from 'lodash'
import fetch from 'node-fetch' // Replaced in node 17.5 w/ experimental native fetch

import { firebase } from '../pages/api/_services'
import { RP, random_bigint, stringToPoint } from '../src/crypto/curve'
import encrypt from '../src/crypto/encrypt'
import { CipherStrings } from '../src/crypto/stringify-shuffle'
import { generateTrackingNum } from '../src/vote/tracking-num'

const api = (route: string, body?: Record<string, unknown>) =>
  fetch(`http://localhost:3000/api/${route}`, {
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

// At the [key] second mark, our target % having voted is the value on the right.
const turnoutGoalAtSecond = {
  120: 0.85,
  25: 0,
  30: 0.01,
  40: 0.1,
  48: 0.3,
  55: 0.5,
  70: 0.75,
  80: 0.9,
}
const smoothTurnoutGoal = (currentSecond: number): number => {
  // First check if there's an exact match.
  const exact = turnoutGoalAtSecond[currentSecond]
  if (exact !== undefined) return exact

  const sortedKeys = Object.keys(turnoutGoalAtSecond)
    .map((k) => parseInt(k))
    .sort((a, b) => a - b)

  // If not, find what it's between
  const above = sortedKeys.find((key) => key > currentSecond)
  const below = [...sortedKeys].reverse().find((key) => key < currentSecond)

  // If we're at either end, return their values
  if (!below) return turnoutGoalAtSecond[above]
  if (!above) return turnoutGoalAtSecond[below]

  // Otherwise, interpolate between them
  const belowValue = turnoutGoalAtSecond[below]
  const aboveValue = turnoutGoalAtSecond[above]
  const fraction = (currentSecond - below) / (above - below)
  return round(belowValue + (aboveValue - belowValue) * fraction, 2)
}

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
const pub_key = RP.fromHex('22fc65439d2612d567676a85da165639102305a5b563b37a0a09de65e3b5bc65')
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
const election_id = '1644707683266'
const submit_random_encrypted_vote = async (auth_token: string) => {
  const response = await api('submit-vote', { auth: auth_token, election_id, encrypted_vote: random_vote() })
  if (response.status !== 200) {
    const { error } = (await response.json()) as { error: string }
    throw error
  }
}

// TODO: Once election begins the unlocking stage, no more votes should come in.
const hasBegunUnlocking = () => false

type Voter = { auth_token: string; email: string }
const getVoters = async (): Promise<Voter[]> =>
  (await firebase.firestore().collection('elections').doc(election_id).collection('voters').get()).docs.map(
    (doc) => ({ ...doc.data() } as Voter),
  )
// const getVoters = () => range(200).map((n) => ({ auth_token: '', email: `demo-voter-${n}@siv.org` }))

const hasNotVoted: Voter[] = []
let numVoters: number
let hasVoted = 0

const mainLoop = (currentSecond: number) => {
  //   Every second, we'll loop:

  // If election began unlocking, we'll stop the loop.
  if (hasBegunUnlocking()) {
    console.log('Election began unlocking 👍')
    process.exit(0)
  }

  //  What % should have voted by now?
  const currentTurnoutGoal = smoothTurnoutGoal(currentSecond)

  // What % has voted?
  const hasVotedPct = round(hasVoted / numVoters, 2)
  // What's the diff?
  const diff = round(currentTurnoutGoal - hasVotedPct, 2)

  console.log(
    `Time: ${currentSecond}. Diff: ${diff}. Target: ${currentTurnoutGoal} vs ${hasVotedPct} Actual: ${hasVoted} / ${numVoters}`,
  )

  // For each voter who hasn't voted yet
  hasNotVoted.forEach(({ auth_token }, index) => {
    // if (diff > RNG)
    // cast a vote for them in this round
    if (diff > Math.random()) {
      //   console.log(`${email}: Simulating vote`)
      hasNotVoted.splice(index, 1)
      hasVoted++
      random_vote()
      submit_random_encrypted_vote(auth_token)
    }
  })
}

;(async () => {
  let seconds = 0

  const voters = await getVoters()
  numVoters = voters.length
  console.log(`Found ${numVoters} voters`)

  // Only simulate for the demo voters
  const demoVoters = voters.filter(({ email }) => email.includes('demo'))
  hasNotVoted.push(...demoVoters)

  setInterval(() => {
    mainLoop(seconds++)
  }, 1000)
})()
