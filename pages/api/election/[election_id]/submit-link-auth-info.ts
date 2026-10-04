import { firebase, pushover, sendEmail } from 'api/_services'
import { button, generateEmailLoginCode } from 'api/admin-login'
import { pusher } from 'api/pusher'
import { validate as validateEmail } from 'email-validator'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { escapeHtml } from 'src/_shared/escapeHtml'
import { safeOrigin } from 'src/_shared/safeOrigin'
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

  const origin = safeOrigin(req)
  if (typeof origin !== 'string') return res.status(500).json(origin)

  const pendingSnap = await pendingVote

  // Already approved / invalidated — don't allow further edits
  if (!pendingSnap.exists) {
    const [accepted, invalidated] = await Promise.all([
      electionDoc.collection('votes').doc(link_auth).get(),
      electionDoc.collection('invalidated_votes').doc(link_auth).get(),
    ])
    const where = accepted.exists ? 'votes' : invalidated.exists ? 'invalidated_votes' : null
    await pushover(
      'submit-link-auth-info: not pending',
      `Election ID: ${election_id}\nlink_auth: ${link_auth}\nwhere: ${where || 'missing'}\n${JSON.stringify({
        email,
        first_name,
        last_name,
      })}`,
    )
    if (!where) return res.status(404).json({ error: 'Vote not found' })
    return res.status(409).json({ error: 'Auth info can no longer be updated' })
  }

  const previous = pendingSnap.data() || {}
  const isResubmit = !!previous.auth_added_at
  const emailChanged = previous.email !== email

  // If resubmit, notify admin
  if (isResubmit)
    await pushover(
      'submit-link-auth-info: resubmit',
      `Election ID: ${election_id}\nlink_auth: ${link_auth}\nprev email:${previous.email}\nnew email:${email}\nemail changed:${emailChanged}`,
    )

  // Server assigns a new verification code, when email is new/changed
  const shouldSendEmail = !isResubmit || emailChanged
  const verification_code = shouldSendEmail ? generateEmailLoginCode() : previous.verification_code

  await Promise.all([
    // store info & email verification code
    pendingVoteDoc.update({
      ...(hasAdditionalAuthInfo ? { additionalAuthInfo } : {}), // Only add additionalAuthInfo if non-empty
      auth_added_at: new Date(),
      email,
      first_name,
      is_email_verified: shouldSendEmail ? false : previous.is_email_verified || false,
      last_name,
      verification_code,

      // Resubmit: archive prior answers
      ...(isResubmit
        ? {
            auth_info_submissions: firestore.FieldValue.arrayUnion({
              additionalAuthInfo: previous.additionalAuthInfo || null,
              at: previous.auth_added_at || null,
              email: previous.email || null,
              first_name: previous.first_name || null,
              is_email_verified: previous.is_email_verified ?? null,
              last_name: previous.last_name || null,
              verification_code: previous.verification_code || null,
            }),
          }
        : {}),
    }),

    // Send verification email if email new/changed
    email &&
      shouldSendEmail &&
      sendEmail({
        from: 'SIV',
        preheader: 'Confirm whether you submitted a vote.',
        recipient: email,
        subject: `Verify your email for ${election.election_title}`,
        text: `<h2 style="margin: 0;">Verify your email address</h2>
      Someone submitted a vote in the Election <b><em>${escapeHtml(
        election.election_title,
      )}</em></b> using the following information:

      <b>First Name:</b> ${escapeHtml(first_name)}
      <b>Last Name:</b> ${escapeHtml(last_name)}
      <b>Email:</b> ${escapeHtml(email)}

      If this was you, please confirm:

      ${button(
        `${origin}/verify_registration?email=${encodeURIComponent(
          email,
        )}&code=${verification_code}&election_id=${election_id}&link_auth=${link_auth}`,
        'Confirm this was me',
      )}

      <em style="font-size:11px; opacity: 0.6;">
      Didn't submit this vote? <a href="${origin}/verify_registration?code=${verification_code}&election_id=${election_id}&link_auth=${link_auth}&invalid=true">Mark it as invalid.</a></em>`,
      }),

    // Trigger admin's dashboard update
    pusher.trigger(`status-${election_id}`, 'votes', link_auth),
  ])

  // Send success down to client
  return res.status(201).send('Success')
}
