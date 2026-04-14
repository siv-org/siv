import bluebird from 'bluebird'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { buildSubject } from 'pages/api/invite-voters'

import { firebase, mailgun, pushover } from '../../../_services'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }
  if (!election_id) return res.status(401).json({ error: 'Missing election_id' })

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  // #region agent log
  fetch('http://127.0.0.1:7532/ingest/3b7aaa0c-d569-420d-ad8b-a6097c399793', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '99584a' },
    body: JSON.stringify({
      sessionId: '99584a',
      runId: 'pre-fix',
      hypothesisId: 'A',
      location: 'check-voter-invite-status.ts:entry',
      message: 'check-voter-invite-status invoked after jwt ok',
      data: { election_id },
      timestamp: Date.now(),
    }),
  }).catch(() => {})
  // #endregion

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

          const voterDoc = electionDoc.collection('voters').doc(to)
          // Confirm voterDoc exists
          if (!(await voterDoc.get()).exists) {
            // #region agent log
            fetch('http://127.0.0.1:7532/ingest/3b7aaa0c-d569-420d-ad8b-a6097c399793', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '99584a' },
              body: JSON.stringify({
                sessionId: '99584a',
                runId: 'pre-fix',
                hypothesisId: 'E',
                location: 'check-voter-invite-status.ts:no-voter-doc',
                message: 'mailgun event skipped — no firestore voter doc for To header',
                data: { to, event: item.event },
                timestamp: Date.now(),
              }),
            }).catch(() => {})
            // #endregion
            return console.log(`No voter doc for ${to}`)
          }

          num_events++
          // #region agent log
          if (item.event === 'failed' || item.event === 'permanent_fail' || item.event === 'complained')
            fetch('http://127.0.0.1:7532/ingest/3b7aaa0c-d569-420d-ad8b-a6097c399793', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '99584a' },
              body: JSON.stringify({
                sessionId: '99584a',
                runId: 'pre-fix',
                hypothesisId: 'E',
                location: 'check-voter-invite-status.ts:write-failure-ish-event',
                message: 'writing mailgun event to voter',
                data: { to, event: item.event },
                timestamp: Date.now(),
              }),
            }).catch(() => {})
          // #endregion
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
