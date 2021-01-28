import bluebird from 'bluebird'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'
import { send_invitation_email } from '../../../invite-voters'

const { ADMIN_PASSWORD } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }
  const { password, voters } = req.body

  // Check password
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid Password.' })

  // Lookup election title
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const { election_title } = (await electionDoc.get()).data() as { election_title?: string }
  const subject_line = `Vote Invitation${election_title ? `: ${election_title}` : ''}`

  // Email each voter their auth token
  await bluebird.map(
    voters,
    async (email: string) => {
      // Lookup voter info
      const voter_doc = await electionDoc.collection('voters').doc(email).get()
      if (!voter_doc.exists) return { error: `Can't find voter ${email}` }
      const { auth_token } = { ...voter_doc.data() } as { auth_token: string }

      const link = `${req.headers.origin}/election/${election_id}/vote?auth=${auth_token}`

      return send_invitation_email({ link, subject_line, voter: email }).then((result) => {
        console.log(email, result)
        // TODO: Store queued_at in DB (if success)

        // Wait a second after sending to not overload Mailgun
        return new Promise((res) => setTimeout(res, 1000))
      })
    },
    { concurrency: 10 },
  ),
    await res.status(201).json({ message: 'Done' })
}
