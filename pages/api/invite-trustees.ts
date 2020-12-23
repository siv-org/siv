import { mapValues } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'

import { generate_key_pair } from '../../src/crypto/generate-key-pair'
import { generate_safe_prime } from '../../src/crypto/generate-safe-prime'
import { generate_public_coefficients, pick_private_coefficients } from '../../src/crypto/threshold-keygen'
import { firebase, pushover, sendEmail } from './_services'
import { generateAuthToken } from './invite-voters'

const { ADMIN_PASSWORD } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // 1. Check for password
  const { password, trustees } = req.body
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).end('Invalid Password.')
  }

  // 2. Generate a safe prime of the right bit size
  const safe_prime_bigs = generate_safe_prime(40)
  const safe_prime = mapValues(safe_prime_bigs, (v) => v.toString())

  // 3. Create a new election
  const election_id = Number(new Date()).toString()
  const election = firebase.firestore().collection('elections').doc(election_id)
  await election.set({ created_at: new Date(), ...safe_prime, t: trustees.length })

  // 4. Generate auth token for each trustee
  const auth_tokens = trustees.map(() => generateAuthToken())

  // 5. Store auth tokens in db
  await Promise.all(
    trustees.map((trustee: string, index: number) =>
      election.collection('trustees').doc(trustee).set({ auth_token: auth_tokens[index], email: trustee, index }),
    ),
  )

  // 6. Email each trustee their auth token
  await Promise.all(
    trustees.map((trustee: string, index: number) => {
      if (trustee === 'admin@secureinternetvoting.org') {
        return
      }

      const link = `${req.headers.origin}/election/${election_id}/key-generation?trustee_auth=${auth_tokens[index]}`

      return sendEmail({
        recipient: trustee,
        subject: `Key Generation for Election ${election_id}`,
        text: `Dear ${trustee},

You're invited to join a SIV Multiparty Key Generation.

This helps thoroughly anonymize election votes.
Each Trustee adds an extra layer of vote privacy.

Click here to join:
<a href="${link}">${link}</a>

<em style="font-size:10px; opacity: 0.6;">This link is unique for you. Don't share it with anyone, or they'll be able to impersonate you.</em>`,
      })
    }),
  )

  // 7. Generate admin's keypair
  const pair = generate_key_pair(safe_prime_bigs.p)

  // 8. Generate admin's private coefficients and public commitments
  const private_coefficients = pick_private_coefficients(trustees.length, safe_prime_bigs)
  const commitments = generate_public_coefficients(private_coefficients, safe_prime_bigs)

  // Store all this admin data
  await election
    .collection('trustees')
    .doc('admin@secureinternetvoting.org')
    .update({
      commitments,
      decryption_key: pair.decryption_key.toString(),
      private_coefficients: private_coefficients.map((c) => c.toString()),
      recipient_key: pair.public_key.recipient.toString(),
    })

  // 9. Send Admin push notification
  pushover(`Invited ${trustees.length} trustees`, trustees.join(', '))

  return res.status(201).end(election_id)
}
