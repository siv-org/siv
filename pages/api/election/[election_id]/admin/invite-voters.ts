import { firebase } from 'api/_services'
import { buildSubject, send_invitation_email } from 'api/invite-voters'
import { checkJwtOwnsElection } from 'api/validate-admin-jwt'
import { NextApiRequest, NextApiResponse } from 'next'
import throat from 'throat'

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

  // Email each voter their auth token
  await Promise.all(
    voters.map(
      throat(10, async (auth_token: string) => {
        // Lookup voter info
        const voter_doc = electionDoc.collection('approved-voters').doc(auth_token)
        const voter = await voter_doc.get()
        if (!voter.exists) return { error: `Can't find voter: ${auth_token}` }
        const { email, invite_queued } = { ...voter.data() } as { email: string; invite_queued?: QueueLog[] }

        const link = `${req.headers.origin}/election/${election_id}/vote?auth=${auth_token}`
        // const link = `https://siv.org/election/${election_id}/vote?auth=${auth_token}`

        return send_invitation_email({
          from: election_manager,
          link,
          subject_line: buildSubject(election_title),
          tag: `invite-voter-${election_id}`,
          voter: email,
        }).then((result) => {
          console.log(email, result)
          return Promise.all([
            // Store queued_log in DB
            voter_doc.update({ invite_queued: [...(invite_queued || []), { result, time: new Date() }] }),

            // Wait at least a second before starting next Mailgun send
            new Promise((res) => setTimeout(res, 1000)),
          ])
        })
      }),
    ),
  ).catch((error) => {
    console.log('🟥 Error sending voter invitations:', error)
    throw res.status(400).json({ error: error.message || JSON.stringify(error) })
  })

  res.status(201).json({ message: 'Done' })
}
