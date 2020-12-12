import { mapValues } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'

import { generate_safe_prime } from '../../src/crypto/generate-safe-prime'
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
  const safe_prime = mapValues(generate_safe_prime(40), (v) => v.toString())

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
        subject: 'Your Invitation To Threshold Key Generation',
        text: `Dear ${trustee},

You've been invited to take part in a SIV Threshold Key Generation.

This will help thoroughly anonymize the SIV votes.
The more trustees there are, the more protected the votes are.

Click here to join:
<a href="${link}">${link}</a>

<em style="font-size:10px; opacity: 0.6;">This link is unique for you. Don't share it with anyone, or they'll be able to impersonate you.</em>`,
      })
    }),
  )

  // 5. Send Admin push notification
  pushover(`Invited ${trustees.length} trustees`, trustees.join(', '))

  return res.status(201).end(election_id)
}
