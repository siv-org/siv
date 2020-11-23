import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover, sendEmail } from './_services'

const { ADMIN_PASSWORD } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // 1. Check for password
  const { ballot_design, password, voters } = req.body
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).end('Invalid Password.')
  }

  // 2. Generate auth token for each voter
  const auth_tokens = voters.map(() => generateAuthToken())

  // 3. Store auth tokens in db
  const election_id = Number(new Date()).toString()
  const election = firebase.firestore().collection('elections').doc(election_id)
  await election.set({ ballot_design, created_at: new Date() }) // So we can query if election exists later
  await Promise.all(
    voters.map((voter: string, index: number) =>
      election.collection('voters').doc(voter).set({ auth_token: auth_tokens[index], email: voter, index }),
    ),
  )

  // 4. Email each voter their auth token
  await Promise.all(
    voters.map((voter: string, index: number) => {
      const link = `${req.headers.origin}/election/${election_id}/vote?auth=${auth_tokens[index]}`

      return sendEmail({
        recipient: voter,
        subject: 'Vote Invitation',
        text: `<h2 style="margin: 0">Vote Invitation</h2>
Click here to securely cast your vote:
<a href="${link}">${link}</a>

<em style="font-size:13px; opacity: 0.6;">This link is unique for you. Don't share it with anyone.</em>`,
      })
    }),
  )

  // 5. Send Admin push notification
  pushover(`Invited ${voters.length} voters`, voters.join(', '))

  return res.status(201).end(election_id)
}

export function generateAuthToken() {
  const random = Math.random()
  const integer = String(random).slice(2)
  const hex = Number(integer).toString(16)
  const auth_token = hex.slice(0, 10)
  return auth_token
}
