import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }
  const { auth } = req.body

  // Similar validations as in `check-auth-token`
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const voters = electionDoc.collection('voters').where('auth_token', '==', auth).get()

  // Is there no voter w/ this Auth Token?
  const [voter] = (await voters).docs
  if (!voter) return res.status(400).send('No pending application')

  // Was the auth token pre-approved (don't leak)
  const wasPreApproved = !voter.data().applied_at
  if (wasPreApproved) return res.status(400).send('No pending application')

  // Was the email already verified
  const wasVerified = voter.data().is_email_verified == true
  if (wasVerified) return res.status(200).send('Verified')

  // Must still be pending application
  return res.status(200).send('Unverified')
}
