import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover, sendEmail } from './_services'
import { generateAuthToken } from './invite-voters'

const { ADMIN_PASSWORD } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { password } = req.query
  const election_id = ''

  if (!election_id) return res.status(404).json({ error: 'Missing election_id' })

  // ** ADD VOTERS HERE
  const voters_to_add: string[] = ['another_voter@dsernst.com', 'd@dsernst.com']

  // 1. Check for password
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid Password.' })

  // 2. Generate auth token for each voter
  const auth_tokens = voters_to_add.map(() => generateAuthToken())

  // This will hold all our async tasks
  const promises: Promise<unknown>[] = []

  // 3. Store auth tokens in db
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  const loadVoters = electionDoc.collection('voters').get()
  const election = { ...(await electionDoc.get()).data() }

  const { election_title } = election

  const existing_voters = new Set()
  ;(await loadVoters).docs.map((d) => existing_voters.add(d.data().email))

  console.log({ existing_voters })

  const new_voters: string[] = []
  voters_to_add.forEach((v) => {
    // Only add if they weren't already added
    if (!existing_voters.has(v)) {
      new_voters.push(v)
    } else {
      console.log(v, 'already added')
    }
  })

  console.log({ new_voters })

  promises.push(
    Promise.all(
      new_voters.map((voter: string, index: number) =>
        electionDoc.collection('voters').doc(voter).set({ auth_token: auth_tokens[index], email: voter, index }),
      ),
    ),
  )

  // 4. Email each voter their auth token
  promises.push(
    Promise.all(
      new_voters.map((voter: string, index: number) => {
        const link = `https://secureinternetvoting.org/election/${election_id}/vote?auth=${auth_tokens[index]}`

        const subject_line = `Vote Invitation${election_title ? `: ${election_title}` : ''}`

        return sendEmail({
          recipient: voter,
          subject: subject_line,
          text: `<h2 style="margin: 0">${subject_line}</h2>
Click here to securely cast your vote:
<a href="${link}">${link}</a>

<em style="font-size:13px; opacity: 0.6;">This link is unique for you. Don't share it with anyone.</em>`,
        })
      }),
    ),
  )

  // 5. Send Admin push notification
  promises.push(pushover(`Invited ${new_voters.length} new voters`, new_voters.join(', ')))

  await Promise.all(promises)

  return res
    .status(201)
    .json({ message: `Invited ${new_voters.length} new voters to ${election_title}: ${new_voters.join(', ')}` })
}
