import bluebird from 'bluebird'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'
import { send_invitation_email } from '../../../invite-voters'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'

export type QueueLog = { result: string; time: Date }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }
  const { voters } = req.body

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  // Lookup election title
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const { election_manager, election_title } = (await electionDoc.get()).data() as {
    election_manager?: string
    election_title?: string
  }
  const subject_line = `Vote Invitation${election_title ? `: ${election_title}` : ''}`

  // Email each voter their auth token
  await bluebird
    .map(
      voters,
      async (email: string) => {
        // Lookup voter info
        const voter_doc = electionDoc.collection('voters').doc(email)
        const voter = await voter_doc.get()
        if (!voter.exists) return { error: `Can't find voter ${email}` }
        const { auth_token, invite_queued } = { ...voter.data() } as { auth_token: string; invite_queued?: QueueLog[] }

        const link = `${req.headers.origin}/election/${election_id}/vote?auth=${auth_token}`
        // const link = `https://secureinternetvoting.org/election/${election_id}/vote?auth=${auth_token}`

        return send_invitation_email({ from: election_manager, link, subject_line, voter: email }).then((result) => {
          console.log(email, result)
          // Store queued_log in DB
          voter_doc.update({ invite_queued: [...(invite_queued || []), { result, time: new Date() }] })

          // Wait a second after sending to not overload Mailgun
          return new Promise((res) => setTimeout(res, 1000))
        })
      },
      { concurrency: 10 },
    )
    .catch((error) => {
      throw res.status(400).json({ error })
    })
  await res.status(201).json({ message: 'Done' })
}
