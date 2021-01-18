/* eslint-disable prefer-const */
import bluebird from 'bluebird'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, mailgun } from './_services'
import { send_invitation_email } from './invite-voters'

const { ADMIN_PASSWORD } = process.env

// Run me by visiting http://localhost:3000/api/resend-invitations?password=INSERT_PASSWORD

// *** Script parameters ***
const election_id = ''
const batch_limit = 100
const vote_page_url = `https://secureinternetvoting.org/election/${election_id}/vote`
// *************************

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { password } = req.query

  // Check for required params
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid Password.' })
  if (!election_id) return res.status(401).json({ error: 'Missing election_id' })

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  const { election_title } = (await electionDoc.get()).data() as { election_title?: string }
  console.log({ election_title })
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
  let alreadySentMap: Sent = {}
  let mgEventsList = await getMgEvents()
  while (mgEventsList.items.length) {
    alreadySentMap = mgEventsList.items.reduce((memo: Sent, i: { recipient: string }) => {
      memo[i.recipient] = (memo[i.recipient] || 0) + 1
      return memo
    }, alreadySentMap)
    console.log(`Queried ${Object.keys(alreadySentMap).length} already sent`)
    mgEventsList = await getMgEvents(mgEventsList.paging.next.split('https://api.mailgun.net/v3')[1])
  }

  let num_already_sent = Object.keys(alreadySentMap).length
  console.log({ num_already_sent })

  // Get all voters
  const all_voters = (await electionDoc.collection('voters').get()).docs.map((d) => ({ ...d.data() }))

  let sent_this_batch = 0
  await bluebird.map(
    all_voters,
    (voter) => {
      // Has this voter already been sent an invitation?
      if (alreadySentMap[voter.email]) return

      // No? Let's resend their invitation
      const link = `${vote_page_url}?auth=${voter.auth_token}`

      if (sent_this_batch > batch_limit) return console.log

      return send_invitation_email({ link, subject_line, voter: voter.email })
        .then((result) => {
          console.log(voter.email, result)
          sent_this_batch += 1
          // eslint-disable-next-line sort-keys-fix/sort-keys-fix
          console.log({ sent_this_batch, batch_limit, total_sent: num_already_sent + sent_this_batch })
          // Wait a second after sending to not overload Mailgun
          return new Promise((res) => setTimeout(res, 1000))
        })
        .catch((error) => {
          sent_this_batch += 1
          const error_msg = `❌ ERROR: ${voter.email} ${error}\n`
          console.error(error_msg)

          throw 'Stopping. Comment out this throw line to just continue'
        })
    },
    { concurrency: 3 },
  )

  console.log('👍 DONE')

  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  await res.json({ sent_this_batch, batch_limit, total_sent: num_already_sent + sent_this_batch, alreadySentMap })
}
