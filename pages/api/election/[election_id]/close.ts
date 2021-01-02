const { ADMIN_PASSWORD } = process.env

import { mapValues, shuffle } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'

import decrypt from '../../../../src/crypto/decrypt'
import { decode } from '../../../../src/crypto/encode'
import { big, bigPubKey } from '../../../../src/crypto/types'
import { firebase } from '../../_services'

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
  const { private_keyshare: decryption_key } = { ...(await admin).data() } as { private_keyshare: string }

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

  await electionDoc.update({ closed_at: new Date(), decrypted })

  res.status(201).send('Closed')
}
