import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, mailgun, pushover } from '../../src/admin/services'

const { ADMIN_PASSWORD } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // 1. Check for password
  const { password, voters } = req.body
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).end('Invalid Password.')
  }

  // 2. Generate auth token for each voter
  const auth_tokens = voters.map(() => generateAuthToken())

  // 3. Store auth tokens in db
  const election_id = Number(new Date()).toString()
  const election = firebase.firestore().collection('elections').doc(election_id)
  await election.set({ created_at: new Date() }) // So we can query if election exists later
  await Promise.all(
    voters.map((voter: string, index: number) =>
      election.collection('voters').doc(voter).set({ auth_token: auth_tokens[index], email: voter, index }),
    ),
  )

  // 4. Email each voter their auth token
  await Promise.all(
    voters.slice(-1).map((voter: string, index: number) => {
      const link = `www.secureinternetvoting.org/demo-election?election=${election_id}&auth=${auth_tokens[index]}`

      return mailgun.messages().send({
        from: 'SIV Admin <admin@secureinternetvoting.org>',
        html: `Voting for the Best Ice Cream is now open.

Votes accepted for the next 24 hours.

Click here to securely cast your vote:
<a href="${link}">${link}</a>

<em style="font-size:10px">This link is unique for you. Don't share it with anyone, or they'll be able to take your vote.</em>`.replace(
          /\n/g,
          '<br />',
        ),
        subject: 'Vote Invitation',
        to: 'admin@secureinternetvoting.org',
      })
    }),
  )

  // 5. Send Admin push notification
  pushover(`Invited ${voters.length} voters`, voters.join(', '))

  return res.status(200).end('Success.')
}

function generateAuthToken() {
  const random = Math.random()
  const integer = String(random).slice(2)
  const hex = Number(integer).toString(16)
  const auth_token = hex.slice(0, 10)
  return auth_token
}
