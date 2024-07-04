import { firebase, pushover } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, election_id, email } = req.body
  // Validate the request has required parameters
  if (!code || !email || !election_id) return res.status(400).json({ error: 'Missing parameters.' })

  // Lookup the voter doc
  const voterDoc = await firebase
    .firestore()
    .collection('elections')
    .doc(election_id)
    .collection('voters')
    .doc(email)
    .get()

  // Check if the verification code is good
  if (!voterDoc.exists || voterDoc.data()?.verification_code !== code) {
    pushover(
      'Verify reg-link, bad code',
      `Email:${email}\n\nInput code: ${code}\nDB code: ${
        voterDoc.data()?.verification_code
      }\n\nElection ID: ${election_id}`,
    )

    // Verification failed, return an error response
    return res.status(400).json({ error: 'Invalid verification code' })
  }

  // Update the status to 'verified'
  await voterDoc.ref.update({ is_email_verified: true })

  // Return a success response
  return res.status(200).json({ message: 'Email verified successfully.' })
}
