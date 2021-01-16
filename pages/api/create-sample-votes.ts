import { mapValues } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'

import { encode } from '../../src/crypto/encode'
import encrypt from '../../src/crypto/encrypt'
import pick_random_integer from '../../src/crypto/pick-random-integer'
import { big, bigPubKey } from '../../src/crypto/types'
import { generateTrackingNum } from '../../src/vote/tracking-num'
import { firebase } from './_services'
import { generateAuthToken } from './invite-voters'
import { pusher } from './pusher'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Disable this endpoint
  return res.status(401).end()

  const election_id = '1610777062403'
  const p = '84490233071588324613543045838826431628034872330024413446004719838344478256747'
  const threshold_key = '9634851030654637484180832422863293041136054844586992867984961075284329440070'
  const pub_key = bigPubKey({ generator: '4', modulo: p, recipient: threshold_key })

  const num_samples = 500

  const election = firebase.firestore().collection('elections').doc(election_id)

  await Promise.all(
    new Array(num_samples).fill('').map(() => {
      const tracking = generateTrackingNum()
      const randomVote = (item_index: 0 | 1) =>
        `${tracking}:${
          ballot_schema[item_index].options[Math.floor(Math.random() * (ballot_schema[0].options.length + 1))]?.name ||
          'BLANK'
        }`

      const plaintext = {
        parks_1: randomVote(0),
        parks_2: randomVote(0),
        president: randomVote(1),
      }

      const encoded = mapValues(plaintext, encode)
      const randomizers = mapValues(plaintext, () => pick_random_integer(big(p)))
      const encrypted_vote = mapValues(plaintext, (_, key: keyof typeof plaintext) =>
        mapValues(encrypt(pub_key, randomizers[key], big(encoded[key])), (b) => b.toString()),
      )

      const auth = generateAuthToken()
      const created_at = new Date()

      console.log({ auth, created_at, encoded, encrypted_vote, plaintext })
      return election.collection('votes').add({ auth, created_at, encrypted_vote })
    }),
  )

  await pusher.trigger(`create-${election_id}`, 'votes', 'foo')

  return res.status(200).json({ message: `Inserted ${num_samples} sample vote` })
}

const ballot_schema = [
  {
    id: 'parks',
    multiple_votes_allowed: 2,
    options: [
      { name: 'Zion' },
      { name: 'Arches' },
      { name: 'Bryce Canyon' },
      { name: 'Canyonlands' },
      { name: 'Capitol Reef' },
    ],
    title: 'Which are your two favorite national parks in Utah?',
  },
  {
    id: 'president',
    options: [
      { name: 'Dwight D. Eisenhower' },
      { name: 'Richard Nixon' },
      { name: 'Gerald Ford' },
      { name: 'Ronald Reagan' },
      { name: 'George H.W. Bush' },
    ],
    title: 'Who was the greatest Republican President of the late 20th Century?',
  },
]
