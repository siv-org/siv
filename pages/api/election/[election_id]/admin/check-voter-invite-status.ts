import bluebird from 'bluebird'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, mailgun, pushover } from '../../../_services'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }
  if (!election_id) return res.status(401).json({ error: 'Missing election_id' })

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  // Get election title and created_at
  const { created_at, election_title } = (await electionDoc.get()).data() as {
    created_at: { _seconds: number }
    election_title?: string
  }
  const subject_line = `Vote Invitation${election_title ? `: ${election_title}` : ''}`

  // Find one page of mailgun events for this election
  function getMgEvents(next?: string) {
    return mailgun.get(next || '/secureinternetvoting.org/events', {
      ascending: 'yes',
      begin: new Date(created_at._seconds * 1000).toUTCString(),
      limit: 300,
      subject: subject_line,
    })
  }

  let num_events = 0

  // Tail through the events until we're out
  let mgEventsList = await getMgEvents()
  while (mgEventsList.items.length) {
    await bluebird
      .map(
        mgEventsList.items,
        async (item: { event: string; recipient: string }) => {
          // Skip replies to us
          if (item.recipient === 'election@secureinternetvoting.org') return
          const voterDoc = electionDoc.collection('voters').doc(item.recipient)
          // Confirm voterDoc exists
          if (!(await voterDoc.get()).exists) {
            return console.log(`No voter doc for ${item.recipient}`)
          }

          num_events++
          // Store new items on voters' docs
          return voterDoc.update({ [`mailgun_events.${item.event}`]: firestore.FieldValue.arrayUnion(item) })
        },
        { concurrency: 3 },
      )
      .catch((error) => {
        console.log(error)
        pushover('Mailgun check-voter-invite-status error', error)
      })
    mgEventsList = await getMgEvents(mgEventsList.paging.next.split('https://api.mailgun.net/v3')[1])
  }

  return res.json({ num_events })
}
