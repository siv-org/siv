import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }
  const { auth } = req.body

  await getEmail(auth, election_id, {
    fail: () => res.status(400).send('no pending application'),
    pass: (email) => res.status(200).json({ email }),
  })
}

type Response = (message: string) => void

export async function getEmail(
  auth: string,
  election_id: string,
  { fail, pass }: { fail: () => void; pass: Response },
) {
  // Similar validations as in `check-auth-token`
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const voters = electionDoc.collection('voters').where('auth_token', '==', auth).get()

  // Is there no voter w/ this Auth Token?
  const [voter] = (await voters).docs
  if (!voter) return fail()

  // Was the auth token pre-approved (don't leak)
  const wasPreApproved = !voter.data().applied_at
  if (wasPreApproved) return fail()

  // Was the email already verified
  const wasVerified = voter.data().status == 'verified'
  if (wasVerified) return pass('Verified')

  // Must still be pending application, pass the email
  const { email } = voter.data()
  pass(email)
}
