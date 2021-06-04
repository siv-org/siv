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

  const election_id = '1612818814403'
  const p = '84490233071588324613543045838826431628034872330024413446004719838344478256747'
  const threshold_key = '25753591117431663234613254388754657393582184952307187183880669779500171305735'
  const pub_key = bigPubKey({ generator: '4', modulo: p, recipient: threshold_key })

  const num_samples = 100

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
        favorite_apple: randomVote(0),
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

  await pusher.trigger(`status-${election_id}`, 'votes', 'sample-votes')

  return res.status(200).json({ message: `Inserted ${num_samples} sample vote` })
}

const ballot_schema = [
  {
    id: 'favorite_apple',
    options: [{ name: 'Cosmic Crisp' }, { name: 'Honey Crisp' }, { name: 'Golden Delicious' }],
    title: 'Which is the best Washington State apple?',
    write_in_allowed: true,
  },
]
