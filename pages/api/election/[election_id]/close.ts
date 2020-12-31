const { ADMIN_PASSWORD } = process.env

import { mapValues, shuffle } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'

import decrypt from '../../../../src/crypto/decrypt'
import { decode } from '../../../../src/crypto/encode'
import { big } from '../../../../src/crypto/types'
import { decryption_key, public_key } from '../../../../src/protocol/election-parameters'
import { firebase } from '../../_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id, password } = req.query
  if (password !== ADMIN_PASSWORD) return res.status(401).send('Invalid Password.')

  const election = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin preloading this request
  const loadVotes = election.collection('votes').get()

  // Is election_id in DB?
  if (!(await election.get()).exists) return res.status(400).send('Unknown Election ID.')

  // Decrypt votes
  const votes = (await loadVotes).docs.map((doc) => {
    const { encrypted_vote } = doc.data()
    return mapValues(encrypted_vote, (value) =>
      decode(
        decrypt(public_key, big(decryption_key), {
          encrypted: big(value.encrypted),
          unlock: big(value.unlock),
        }),
      ),
    )
  })

  // Anonymize votes
  const decrypted = shuffle(votes)

  await election.update({ closed_at: new Date(), decrypted })

  res.status(201).send('Closed')
}
