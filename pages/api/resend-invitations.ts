/* eslint-disable prefer-const */
import bluebird from 'bluebird'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, mailgun, sendEmail } from './_services'

const { ADMIN_PASSWORD } = process.env

const election_id = '1610822485943'
const resend_limit = 1

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { password } = req.query

  // Check for password
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid Password.' })

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  const { election_title } = (await electionDoc.get()).data() as { election_title?: string }
  const subject_line = `Vote Invitation${election_title ? `: ${election_title}` : ''}`

  function getMgEvents(next?: string) {
    return mailgun.get(next || '/secureinternetvoting.org/events', {
      ascending: 'yes',
      begin: '16 Jan 2021 10:00:00 -0800',
      // end: '16 Jan 2021 10:00:00 -0800',
      event: ['accepted'],
      limit: 300,
      subject: subject_line,
    })
  }

  // Get list of people who already received
  type Sent = Record<string, number>
  let alreadySent: Sent = {}
  let alreadySentList = await getMgEvents()
  while (alreadySentList.items.length) {
    alreadySent = alreadySentList.items.reduce((memo: Sent, i: { recipient: string }) => {
      memo[i.recipient] = (memo[i.recipient] || 0) + 1
      return memo
    }, alreadySent)
    console.log(`Queried ${Object.keys(alreadySent).length} already sent`)
    alreadySentList = await getMgEvents(alreadySentList.paging.next.split('https://api.mailgun.net/v3')[1])
  }

  let sent = Object.keys(alreadySent).length
  let resent = 0

  console.log('Already sent', sent)

  // Get all voters
  const all_voters = (await electionDoc.collection('voters').get()).docs.map((d) => ({ ...d.data() }))

  await bluebird.map(
    all_voters,
    (voter) => {
      // Has this voter already received?
      if (alreadySent[voter.email]) return bluebird.resolve()

      // Otherwise resend their invitation
      const link = `https://secureinternetvoting.org/election/${election_id}/vote?auth=${voter.auth_token}`

      if (resent > resend_limit) return bluebird.resolve()

      return sendEmail({
        recipient: voter.email,
        subject: subject_line,
        text: `<h2 style="margin: 0">${subject_line}</h2>
                    Click here to securely cast your vote:
                    <a href="${link}">${link}</a>

                    <em style="font-size:13px; opacity: 0.6;">This link is unique for you. Don't share it with anyone.</em>`,
      })
        .then((result) => {
          console.log(voter.email, result)
          sent += 1
          resent += 1
          console.log({ sent })
          return new Promise((res) => setTimeout(res, 2000))
        })
        .catch((error) => {
          resent += 1
          console.log('ERROR:', voter.email, error)
          return bluebird.resolve()
        })
    },
    { concurrency: 1 },
  )

  await res.json({ alreadySent })
}
