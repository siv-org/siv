import { firebase } from 'api/_services'
import { checkJwtOwnsElection } from 'api/validate-admin-jwt'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { generateAuthToken } from 'src/crypto/generate-auth-tokens'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { new_voters } = req.body
  const { election_id } = req.query as { election_id: string }

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  if (!election_id) return res.status(401).json({ error: 'Missing election_id' })

  // Generate auth token for each voter
  const auth_tokens = new_voters.map(generateAuthToken)

  // Get existing voter from DB
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const loadVoters = electionDoc.collection('voters').get()
  const existing_voters = new Set()
  ;(await loadVoters).docs.map((d) => existing_voters.add(d.data().email))

  // De-dupe new voters
  const deduped_new_voters = Array.from(new Set(new_voters)) as string[]

  // Separate uniques from already_added
  const unique_new_voters: string[] = []
  const already_added: string[] = []
  deduped_new_voters.forEach((v: string) => {
    if (v) {
      existing_voters.has(v) ? already_added.push(v) : unique_new_voters.push(v)
    }
  })

  console.log({ already_added, unique_new_voters })

  // Add uniques to DB
  await Promise.all(
    unique_new_voters
      .map((voter: string, index: number) =>
        electionDoc
          .collection('voters')
          .doc(voter)
          .set({
            added_at: new Date(),
            auth_token: auth_tokens[index],
            email: voter,
            index: index + existing_voters.size,
          }),
      )
      // Increment electionDoc's num_voters cached tally
      .concat(electionDoc.update({ num_voters: firestore.FieldValue.increment(unique_new_voters.length) })),
  )

  return res.status(201).json({ already_added, unique_new_voters })
}
