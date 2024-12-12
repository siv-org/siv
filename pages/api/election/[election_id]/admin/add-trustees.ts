import { NextApiRequest, NextApiResponse } from 'next'
import { Trustee } from 'src/admin/PrivacyPage/SetPrivacyProtectors'
import { generateAuthToken } from 'src/crypto/generate-auth-tokens'
import { generate_key_pair } from 'src/crypto/generate-key-pair'
import {
  evaluate_private_polynomial,
  generate_public_coefficients,
  pick_private_coefficients,
} from 'src/crypto/threshold-keygen'
import { mapValues } from 'src/utils'

import { firebase, pushover, sendEmail } from '../../../_services'
import { pusher } from '../../../pusher'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'

const { ADMIN_EMAIL } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Ensure env-vars are set
  if (!ADMIN_EMAIL) return res.status(501).json({ error: 'Missing process.env.ADMIN_EMAIL' })

  // This will hold all our async tasks
  const promises: Promise<unknown>[] = []

  const { election_id } = req.query as { election_id: string }

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  const { trustees } = req.body as { trustees: Trustee[] }
  const { election_manager, election_title } = jwt

  // Add admin@ email to front of the trustees list
  trustees.unshift({ email: ADMIN_EMAIL, name: 'The SIV Server' })

  // Update election
  const election = firebase.firestore().collection('elections').doc(election_id)
  await election.update({ t: trustees.length })

  // Generate admin's keypair
  const pair = mapValues(generate_key_pair(), String)

  // If admin is only trustees, we can skip the keygen ceremony
  if (trustees.length === 1) {
    const threshold_public_key = pair.public_key

    // Save private key on admin
    promises.push(
      election
        .collection('trustees')
        .doc(ADMIN_EMAIL)
        .set({
          ...trustees[0],
          index: 0,
          partial_decryption: 'stage = 12',
          private_keyshare: pair.decryption_key,
        }),
    )

    // Save pub key on election
    promises.push(election.update({ threshold_public_key }))

    await Promise.all(promises)

    // Send back election creation success
    return res.status(201).json({ threshold_public_key })
  }

  // Generate auth token for each trustee
  const auth_tokens = trustees.map(generateAuthToken)

  // Store auth tokens in db
  promises.push(
    Promise.all(
      trustees.map(({ email, name = '' }: Trustee, index: number) =>
        election
          .collection('trustees')
          .doc(email)
          .set({ auth_token: auth_tokens[index], email, index, name }, { merge: true }),
      ),
    ),
  )

  // Email each trustee their auth token
  promises.push(
    Promise.all(
      trustees.map(({ email, name }: Trustee, index: number) => {
        if (email === ADMIN_EMAIL) return

        const link = `${req.headers.origin}/election/${election_id}/observer?auth=${auth_tokens[index]}`

        return sendTrusteeInvite({ election_id, election_manager, election_title, email, link, name })
      }),
    ),
  )

  // Send Admin push notification
  if (election_manager !== 'SIV End2End Tester')
    promises.push(
      pushover(
        `${election_manager} invited ${trustees.length - 1} observer${trustees.length > 2 ? 's' : ''}`,
        trustees
          .slice(1)
          .map((t) => t.email)
          .join(', '),
      ),
    )

  // Generate admin's private coefficients and public commitments
  const private_coefficients = pick_private_coefficients(trustees.length)
  const commitments = generate_public_coefficients(private_coefficients).map(String)

  // Generate admins own keyshare for themselves
  const pairwise_shares_for = {
    [ADMIN_EMAIL]: evaluate_private_polynomial(1, private_coefficients).toString(),
  }
  const decrypted_shares_from = { ...pairwise_shares_for }

  // Store all this new admin data
  promises.push(
    election
      .collection('trustees')
      .doc(ADMIN_EMAIL)
      .set(
        {
          commitments,
          decrypted_shares_from,
          decryption_key: pair.decryption_key,
          keygen_attempt: 1,
          pairwise_shares_for,
          private_coefficients: private_coefficients.map(String),
          recipient_key: pair.public_key,
        },
        { merge: true },
      )
      .then(() => pusher.trigger(`keygen-${election_id}`, 'update', `${ADMIN_EMAIL} created their initial data`)),
  )

  await Promise.all(promises)

  // Finally, send http success back to frontend
  res.status(201).json({ election_id })
}

export const sendTrusteeInvite = ({
  election_id,
  election_manager,
  election_title,
  email,
  link,
  name,
}: {
  election_id: string
  election_manager: string
  election_title?: string
  email: string
  link: string
  name?: string
}) =>
  sendEmail({
    from: `${election_manager} via SIV`,
    recipient: email,
    subject: buildSubject(election_id, election_title),
    text: `Dear ${name || email},
<h3 style="margin-bottom:0">${election_manager} invited you to be a Privacy Protector${
      election_title ? ` for the election: ${election_title}` : ''
    }.</h3>
This gives you cryptographic proof that votes are private & tallied correctly.

Once you click this link, your computer will automatically run the Pre-Election Verification code:

<a href="${link}" style="font-weight: bold;">${link}</a>
<em style="font-size:10px; opacity: 0.6;">This link is unique for you. Don't share it with anyone.</em>

At the end of the election, the Election Manager will ask you to open it again. You need to use the same device. This allows your computer to automatically anonymize & verify all votes, and then unlock them for tallying.

Thank you for helping to make this election more secure.`,
  })

export const buildSubject = (election_id: string, election_title?: string) =>
  `Invitation to be a Verifying Observer: ${election_title || `Election ${election_id}`}`
