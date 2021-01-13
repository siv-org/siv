const { ADMIN_PASSWORD } = process.env

import { mapValues } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'

import decrypt from '../../../../src/crypto/decrypt'
import { decode } from '../../../../src/crypto/encode'
import { shuffle } from '../../../../src/crypto/shuffle'
import { big, bigPubKey } from '../../../../src/crypto/types'
import { firebase } from '../../_services'
import { pusher } from '../../pusher'

const { ADMIN_EMAIL } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!ADMIN_EMAIL) return res.status(501).send('Missing process.env.ADMIN_EMAIL')

  const { election_id, password } = req.query
  if (password !== ADMIN_PASSWORD) return res.status(401).send('Invalid Password.')

  const electionDoc = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin preloading these requests
  const loadVotes = electionDoc.collection('votes').get()
  const election = electionDoc.get()
  const admin = electionDoc.collection('trustees').doc(ADMIN_EMAIL).get()

  // Is election_id in DB?
  if (!(await election).exists) return res.status(400).send('Unknown Election ID.')

  const { g, p, threshold_public_key } = { ...(await election).data() } as {
    g: string
    p: string
    threshold_public_key: string
  }
  const public_key = bigPubKey({ generator: g, modulo: p, recipient: threshold_public_key })

  // First admin removes the auth tokens
  const encrypteds_without_auth_tokens = (await loadVotes).docs.map((doc) => doc.data().encrypted_vote)

  console.log({ encrypteds_without_auth_tokens })

  // Then we split up the votes into individual lists for each item
  // input: [
  //   { item1: Cipher, item2: Cipher },
  //   { item1: Cipher, item2: Cipher },
  // ]
  // output: {
  //   item1: [Cipher, Cipher],
  //   item2: [Cipher, Cipher],
  // }
  const split = encrypteds_without_auth_tokens.reduce((acc, encrypted) => {
    Object.keys(encrypted).forEach((key) => {
      if (!acc[key]) acc[key] = []
      acc[key].push(encrypted[key])
    })
    return acc
  }, {})

  console.log({ split })

  return res.status(201).send('Closed')

  // Then admin does a cryptographic shuffle (permute + re-encryption)
  const shuffled = shuffle(public_key, encrypteds_without_auth_tokens)

  const { private_keyshare: decryption_key } = { ...(await admin).data() } as { private_keyshare: string }

  // Decrypt votes
  const decrypted = shuffled.map((encrypted) => {
    return mapValues(encrypted, (value) =>
      decode(
        decrypt(public_key, big(decryption_key), {
          encrypted: big(value.encrypted),
          unlock: big(value.unlock),
        }),
      ),
    )
  })

  await electionDoc.update({ closed_at: new Date(), decrypted })

  await pusher.trigger(election_id, 'decrypted', '')

  res.status(201).send('Closed')
}
