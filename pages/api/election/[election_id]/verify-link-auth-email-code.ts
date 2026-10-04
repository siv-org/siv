import { firebase, pushover } from 'api/_services'
import { pusher } from 'api/pusher'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { secretsMatch } from 'src/_shared/secretsMatch'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, election_id, invalid, link_auth } = req.body
  // Validate the request has required parameters
  if (!code || !link_auth || !election_id) return res.status(400).json({ error: 'Missing parameters.' })

  const election = firebase.firestore().collection('elections').doc(election_id)

  // Lookup the pending-vote
  let voteDoc = await election.collection('votes-pending').doc(link_auth).get()

  // Pending vote may have been approved & moved to 'votes' collection
  if (!voteDoc.exists) {
    voteDoc = await election.collection('votes').doc(link_auth).get()
    if (!voteDoc.exists) {
      await pushover(
        "Verify link-auth email, couldn't find auth token in 'pending' nor 'approved'",
        `Election ID: ${election_id}\n\nAuth token: ${link_auth}`,
      )

      return res.status(400).json({ error: 'Invalid verification code' })
    }
  }

  const email = voteDoc.data()?.email || '?'

  // Check if the verification code is good
  if (!secretsMatch(voteDoc.data()?.verification_code, code)) {
    await pushover(
      'Verify link-auth email, bad code',
      `Email:${email}\n\nInput code: ${code}\nDB code: ${
        voteDoc.data()?.verification_code
      }\n\nElection ID: ${election_id}`,
    )

    // Verification failed, return an error response
    return res.status(400).json({ error: 'Invalid verification code' })
  }

  const action = invalid ? 'invalid' : 'confirm'
  const ip = String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || '?')
  const ua = String(req.headers['user-agent'] || '?')
  const logEntry = { action, at: new Date(), ip, ua }

  if (invalid) {
    await Promise.all([
      // Update the status + append log
      voteDoc.ref.update({
        email_marked_invalid_at: logEntry.at,
        email_verify_presses: firestore.FieldValue.arrayUnion(logEntry),
        is_email_verified: false,
      }),

      // Notify admin
      pushover(
        'Verify link-auth email marked invalid',
        `Email:${email}\n\nElection ID: ${election_id}\nIP: ${ip}\nUA: ${ua}`,
      ),
    ])

    // Return a success response
    return res.status(200).json({ message: 'Email successfully marked invalid.' })
  }

  await Promise.all([
    // Update the status to 'verified' + append log
    voteDoc.ref.update({
      email_verify_presses: firestore.FieldValue.arrayUnion(logEntry),
      is_email_verified: true,
      verified_email_at: logEntry.at,
    }),

    // Trigger admin's dashboard update
    pusher.trigger(`status-${election_id}`, 'votes', link_auth),
  ])

  // Return a success response
  return res.status(200).json({ message: 'Email verified successfully.' })
}
