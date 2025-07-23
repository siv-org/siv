import { firebase, mailgun, pushover } from 'api/_services'
import { checkJwtOwnsElection } from 'api/validate-admin-jwt'
import bluebird from 'bluebird'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { buildSubject } from 'pages/api/invite-voters'

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

  // Find one page of mailgun events for this election
  function getMgEvents(next?: string) {
    return mailgun.get(next || '/siv.org/events', {
      ascending: 'yes',
      begin: new Date(created_at._seconds * 1000).toUTCString(),
      limit: 300,
      subject: buildSubject(election_title),
    })
  }

  let num_events = 0

  // Tail through the events until we're out
  let mgEventsList = await getMgEvents()
  while (mgEventsList.items.length) {
    await bluebird
      .map(
        mgEventsList.items,
        async (item: { event: string; message: { headers: { to: string } } }) => {
          const to = item.message.headers.to

          // Skip replies to us
          if (to === 'election@siv.org') return

          const voterDocs = electionDoc.collection('approved-voters').where('email', '==', to)
          // Confirm voterDoc exists
          const first = (await voterDocs.get()).docs[0]
          if (!first) return console.log(`No voter doc for ${to}`)

          num_events++
          // Store new items on voters' docs
          return first.ref.update({ [`mailgun_events.${item.event}`]: firestore.FieldValue.arrayUnion(item) })
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
