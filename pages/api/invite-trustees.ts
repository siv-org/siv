import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover, sendEmail } from './_services'
import { generateAuthToken } from './invite-voters'

const { ADMIN_PASSWORD } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // 1. Check for password
  const { ballot_design, password, trustees } = req.body
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).end('Invalid Password.')
  }

  // 2. Generate auth token for each trustee
  const auth_tokens = trustees.map(() => generateAuthToken())

  // 3. Store auth tokens in db
  const election_id = Number(new Date()).toString()
  // TODO: Only do this once... duplicated in api/invite-voters
  const election = firebase.firestore().collection('elections').doc(election_id)
  await election.set({ ballot_design, created_at: new Date() }) // So we can query if election exists later
  await Promise.all(
    trustees.map((trustee: string, index: number) =>
      election.collection('trustees').doc(trustee).set({ auth_token: auth_tokens[index], email: trustee, index }),
    ),
  )

  // 4. Email each trustee their auth token
  await Promise.all(
    trustees.map((trustee: string, index: number) => {
      const link = `${req.headers.origin}/key-generation?election=${election_id}&trustee_auth=${auth_tokens[index]}`

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
