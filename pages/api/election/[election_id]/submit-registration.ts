import { firebase } from 'api/_services'
import { validate as validateEmail } from 'email-validator'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { generateAuthToken } from 'src/crypto/generate-auth-tokens'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Voter submits their registration information
  const { election_id } = req.query as { election_id: string }
  const { email, first_name, last_name } = req.body

  // Begin preloading db data
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const loadElection = electionDoc.get()
  const votersCollection = electionDoc.collection('voters')
  const loadVoters = votersCollection.get()

  // Validate email
  if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email address' })

  // Does this election allow registrations?
  const election = (await loadElection).data() || {}
  if (!election.voter_applications_allowed)
    return res.status(401).json({ error: 'This election disabled Voter Applications' })

  // Is there already a voter or voter application w/ this email?
  // TODO: Ideally we aren't leaking info about who is already registered
  // see https://github.com/dsernst/siv/issues/13#issuecomment-1289732427
  let found_conflict = false
  ;(await loadVoters).docs.find((d) => {
    if (d.data().email === email) {
      found_conflict = true

      // TODO: Smoother handling for these edge cases
      // Are they already approved or pending?
      // If voter was already approved...
      // If voter already has pending application...

      return true
    }
  })
  if (found_conflict) return res.status(409).json({ error: 'Email already applied' })

  // Server assigns them a temp Voter Auth Token,
  const auth_token = generateAuthToken()
  // store as pending review
  await Promise.all([
    votersCollection.doc(email).set({
      applied_at: new Date(),
      auth_token,
      email,
      first_name,
      index: election.num_voters,
      last_name,
      status: 'pending',
    }),
    electionDoc.update({ num_voters: firestore.FieldValue.increment(1) }),
  ])

  // Send new auth token down to voter
  return res.status(201).json({ auth_token })
}
