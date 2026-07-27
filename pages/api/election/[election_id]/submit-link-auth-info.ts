import { firebase, sendEmail } from 'api/_services'
import { button, generateEmailLoginCode } from 'api/admin-login'
import { pusher } from 'api/pusher'
import { validate as validateEmail } from 'email-validator'
import { NextApiRequest, NextApiResponse } from 'next'
import { escapeHtml } from 'src/_shared/escapeHtml'
import { optionalEmail } from 'src/vote/auth/VoterAuthInfoForm'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Voter submits their registration information
  const { election_id } = req.query as { election_id: string }
  const { additionalAuthInfo, email, first_name, last_name, link_auth } = req.body
  const hasAdditionalAuthInfo = additionalAuthInfo && Object.keys(additionalAuthInfo).length > 0

  // Begin preloading db data
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const loadElection = electionDoc.get()
  const pendingVoteDoc = electionDoc.collection('votes-pending').doc(link_auth)
  const pendingVote = pendingVoteDoc.get()

  // Validate email
  if (email && !validateEmail(email) && !optionalEmail.includes(election_id))
    return res.status(422).json({ error: 'Invalid email address' })

  // Does this election allow registrations?
  const election = (await loadElection).data() || {}
  if (!election.voter_applications_allowed)
    return res.status(401).json({ error: 'This election disabled Voter Applications' })

  // Server assigns them a Email-Verification code
  const verification_code = generateEmailLoginCode()

  // Don't allow submitting auth info multiple times
  if ({ ...(await pendingVote).data() }.auth_added_at)
    return res.status(409).json({ error: 'Auth info already submitted' })

  await Promise.all([
    // store info & email verification code
    electionDoc
      .collection('votes-pending')
      .doc(link_auth)
      .update({
        ...(hasAdditionalAuthInfo ? { additionalAuthInfo } : {}), // Only add additionalAuthInfo if non-empty
        auth_added_at: new Date(),
        email,
        first_name,
        is_email_verified: false,
        last_name,
        verification_code,
      }),

    // Send verification email
    email &&
      sendEmail({
        from: 'SIV',
        preheader: 'Confirm whether you submitted a vote.',
        recipient: email,
        subject: `Verify your email for ${election.election_title}`,
        text: `<h2 style="margin: 0;">Verify your email address</h2>
      Someone submitted a vote in the Election <b><em>${
        escapeHtml(election.election_title)
      }</em></b> using the following information:

      <b>First Name:</b> ${escapeHtml(first_name)}
      <b>Last Name:</b> ${escapeHtml(last_name)}
      <b>Email:</b> ${escapeHtml(email)}

      If this was you, please confirm:

      ${button(
        `${req.headers.origin}/verify_registration?email=${encodeURIComponent(email)}&code=${verification_code}&election_id=${election_id}&link_auth=${link_auth}`,
        'Confirm this was me',
      )}

      <em style="font-size:11px; opacity: 0.6;">
      Didn't submit this vote? <a href="${
        req.headers.origin
      }/verify_registration?code=${verification_code}&election_id=${election_id}&link_auth=${link_auth}&invalid=true">Mark it as invalid.</a></em>`,
      }),

    // Trigger admin's dashboard update
    pusher.trigger(`status-${election_id}`, 'votes', link_auth),
  ])

  // Send success down to client
  return res.status(201).send('Success')
}
