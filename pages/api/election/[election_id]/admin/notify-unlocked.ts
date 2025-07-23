import { firebase, sendEmail } from 'api/_services'
import { checkJwtOwnsElection } from 'api/validate-admin-jwt'
import bluebird from 'bluebird'
import { validate } from 'email-validator'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id?: string }

  // Check required params
  if (!election_id) return res.status(401).json({ error: `Missing election_id` })

  const election = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin preloading all these docs
  const loadElection = election.get()
  const loadVoters = election.collection('approved-voters').where('voted_at', '!=', null).get()

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  // Is election_id in DB?
  const electionDoc = await loadElection
  if (!electionDoc.exists) return res.status(400).json({ error: `Unknown Election ID: '${election_id}'` })

  const { election_manager, election_title } = {
    ...electionDoc.data(),
  } as {
    election_manager?: string
    election_title?: string
  }

  // Build voters objects
  const voters: string[] = []
  ;(await loadVoters).docs.forEach((doc) => {
    const { email, invalidated_at } = { ...doc.data() } as { email: string; invalidated_at?: Date }

    if (!validate(email)) return
    if (invalidated_at) return

    voters.push(email)
  })

  // Notify each voter
  await bluebird
    .map(
      voters,
      async (email: string) => {
        return sendEmail({
          from: election_manager,
          recipient: email,
          subject: 'Election Results Posted',
          text: `<h2 style="margin: 0">Election Results Posted</h2>
          ${voters.length} votes for "${election_title}" have been unlocked: ${req.headers.origin}/election/${election_id}
          `,
        }).then(() => {
          // Wait a second after sending to not overload Mailgun
          return new Promise((res) => setTimeout(res, 1000))
        })
      },
      { concurrency: 10 },
    )
    .catch((error) => {
      throw res.status(400).json({ error })
    })

  // Store num notified on electionDoc
  await election.update({ notified_unlocked: voters.length })

  return res.status(200).send(`Sending notification email to ${voters.length} voters`)
}
