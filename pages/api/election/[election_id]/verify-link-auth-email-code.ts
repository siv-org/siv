import { firebase, pushover } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, election_id, email, invalid, link_auth } = req.body
  // Validate the request has required parameters
  if (!code || !link_auth || !election_id) return res.status(400).json({ error: 'Missing parameters.' })

  // Lookup the pending-vote
  const voteDoc = await firebase
    .firestore()
    .collection('elections')
    .doc(election_id)
    .collection('votes-pending')
    .doc(link_auth)
    .get()

  // Check if the verification code is good
  if (!voteDoc.exists || voteDoc.data()?.verification_code !== code) {
    await pushover(
      'Verify link-auth email, bad code',
      `Email:${email}\n\nInput code: ${code}\nDB code: ${
        voteDoc.data()?.verification_code
      }\n\nElection ID: ${election_id}`,
    )

    // Verification failed, return an error response
    return res.status(400).json({ error: 'Invalid verification code' })
  }

  if (invalid) {
    await Promise.all([
      // Update the status
      voteDoc.ref.update({ email_marked_invalid_at: new Date(), is_email_verified: false }),

      // Notify admin
      pushover('Verify link-auth email marked invalid', `Email:${email}\n\nElection ID: ${election_id}`),
    ])

    // Return a success response
    return res.status(200).json({ message: 'Email successfully marked invalid.' })
  }

  // Update the status to 'verified'
  await voteDoc.ref.update({ is_email_verified: true, verified_email_at: new Date() })

  // Return a success response
  return res.status(200).json({ message: 'Email verified successfully.' })
}
