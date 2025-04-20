import { firebase } from 'api/_services'
import { checkJwtOwnsElection } from 'api/validate-admin-jwt'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { generateAuthToken } from 'src/crypto/generate-auth-tokens'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { new_voters } = req.body
  const { election_id } = req.query

  if (typeof election_id !== 'string') return res.status(401).json({ error: 'Missing election_id' })

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  const { already_added, unique_new_emails: unique_new_voters } = await addVotersToElection(new_voters, election_id)

  return res.status(201).json({ already_added, unique_new_voters })
}

/** IMPORTANT: Assumes you already checked user owns election
 *
 * 1. Adds non-duplicate email addresses to ballot voter list
 * 2. Creates and stores unique auth tokens for each
 * 3. Updates election's num_voters tally
 */
export async function addVotersToElection(new_voters: string[], election_id: string) {
  // Get existing voter from DB
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const loadVoters = electionDoc.collection('approved-voters').get()
  const existing_voters = new Set()
  ;(await loadVoters).docs.map((d) => existing_voters.add(d.data().email))

  // De-dupe new voters
  const deduped_new_voters = Array.from(new Set(new_voters)) as string[]

  // Separate uniques from already_added
  const unique_new_emails: string[] = []
  const already_added: string[] = []
  deduped_new_voters.forEach((v: string) => {
    if (!v) return // skip blanks
    existing_voters.has(v) ? already_added.push(v) : unique_new_emails.push(v)
  })

  console.log('Add-voters:', { already_added, election_id, unique_new_emails })
  const email_to_auth: Record<string, string> = {}

  // Generate and store auth tokens for uniques
  await Promise.all(
    unique_new_emails
      .map((email: string, index: number) => {
        const auth_token = generateAuthToken()
        email_to_auth[email] = auth_token
        return electionDoc
          .collection('approved-voters')
          .doc(auth_token)
          .set({
            added_at: new Date(),
            auth_token,
            email,
            index: index + existing_voters.size,
          })
      })
      // Increment electionDoc's num_voters cached tally
      .concat(electionDoc.update({ num_voters: firestore.FieldValue.increment(unique_new_emails.length) })),
  )

  return { already_added, email_to_auth, unique_new_emails }
}
