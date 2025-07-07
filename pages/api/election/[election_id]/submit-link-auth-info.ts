import { firebase, sendEmail } from 'api/_services'
import { button, generateEmailLoginCode } from 'api/admin-login'
import { pusher } from 'api/pusher'
import { validate as validateEmail } from 'email-validator'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Voter submits their registration information
  const { election_id } = req.query as { election_id: string }
  const { email, first_name, last_name, link_auth } = req.body

  // Begin preloading db data
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const loadElection = electionDoc.get()
  const pendingVoteDoc = electionDoc.collection('votes-pending').doc(link_auth)
  const pendingVote = pendingVoteDoc.get()

  // Validate email
  if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email address' })

  // Does this election allow registrations?
  const election = (await loadElection).data() || {}
  if (!election.voter_applications_allowed)
    return res.status(401).json({ error: 'This election disabled Voter Applications' })

  // Server assigns them a Email-Verification code
  const verification_code = generateEmailLoginCode()

  // Don't allow submitting auth info multiple times
  if ({ ...(await pendingVote).data() }.auth_added_at)
    return res.status(400).json({ error: 'Auth info already submitted' })

  await Promise.all([
    // store info & email verification code
    electionDoc.collection('votes-pending').doc(link_auth).update({
      auth_added_at: new Date(),
      email,
      first_name,
      is_email_verified: false,
      last_name,
      verification_code,
    }),

    // Send verification email
    sendEmail({
      from: 'SIV',
      recipient: email,
      subject: `Voter Email Verification: ${email}`,
      text: `A vote was just cast in the Election <b><em>${
        election.election_title
      }</em></b>, with the name and email given:

      <b>First Name:</b> ${first_name}
      <b>Last Name:</b> ${last_name}
      <b>Email:</b> ${email}

      If this WAS you, please click here to verify your email address:

      ${button(
        `${req.headers.origin}/verify_registration?email=${email}&code=${verification_code}&election_id=${election_id}&link_auth=${link_auth}`,
        'Confirm this was me',
      )}

      <em style="font-size:11px; opacity: 0.6;">
      If this was NOT you, click here:
      <a href="${
        req.headers.origin
      }/verify_registration?code=${verification_code}&election_id=${election_id}&link_auth=${link_auth}&invalid=true">This was NOT me, that vote should be marked invalid</a></em>`,
    }),

    // Trigger admin's dashboard update
    pusher.trigger(`status-${election_id}`, 'votes', link_auth),
  ])

  // Send success down to client
  return res.status(201).send('Success')
}
