import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, election_id, email } = req.body

  try {
    // Fetch the voter document based on the email
    const voterSnapshot = await firebase
      .firestore()
      .collection('elections')
      .doc(election_id)
      .collection('voters')
      .doc(email)
      .get()

    // Check if the voter document exists and has the same verification code
    if (voterSnapshot.exists && code && voterSnapshot.data()?.verification_code === code) {
      // Update the status to 'verified'
      await voterSnapshot.ref.update({ status: 'verified' })

      // Return a success response
      return res.status(200).json({ message: 'Email verified successfully.' })
    } else {
      // Verification failed, return an error response
      return res.status(400).json({ error: 'Invalid email or verification code.' })
    }
  } catch (error) {
    console.error('Error verifying email:', error)
    // Return an error response
    return res.status(500).json({ error: 'Internal server error.' })
  }
}
