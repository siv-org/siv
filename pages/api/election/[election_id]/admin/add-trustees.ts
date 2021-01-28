import { mapValues } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'

import { generate_key_pair } from '../../../../../src/crypto/generate-key-pair'
import { get_safe_prime } from '../../../../../src/crypto/generate-safe-prime'
import {
  evaluate_private_polynomial,
  generate_public_coefficients,
  pick_private_coefficients,
} from '../../../../../src/crypto/threshold-keygen'
import { big } from '../../../../../src/crypto/types'
import { firebase, pushover, sendEmail } from '../../../_services'
import { generateAuthToken } from '../../../invite-voters'
import { pusher } from '../../../pusher'

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Ensure env-vars are set
  if (!ADMIN_EMAIL) return res.status(501).json({ error: 'Missing process.env.ADMIN_EMAIL' })
  if (!ADMIN_PASSWORD) return res.status(501).json({ error: 'Missing process.env.ADMIN_PASSWORD' })

  // This will hold all our async tasks
  const promises: Promise<unknown>[] = []

  // Check for password
  const { election_title, password, trustees } = req.body
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid Password.' })

  // admin@ is required
  if (!trustees.some((t: string) => t === ADMIN_EMAIL))
    return res.status(400).json({ error: `${ADMIN_EMAIL} is a required trustee` })

  // Generate a safe prime of the right bit size
  const safe_prime_bigs = get_safe_prime(256, 20)
  const safe_prime = mapValues(safe_prime_bigs, (v) => v.toString())

  // Update election
  const { election_id } = req.query as { election_id: string }
  const election = firebase.firestore().collection('elections').doc(election_id)
  await election.update({ ...safe_prime, t: trustees.length })

  // Generate admin's keypair
  const pair = generate_key_pair(safe_prime_bigs.p)

  // If admin is only trustees, we can skip the keygen ceremony
  if (trustees.length === 1) {
    const threshold_public_key = pair.public_key.recipient.toString()

    // Save private key on admin
    promises.push(
      election.collection('trustees').doc(ADMIN_EMAIL).set({
        email: ADMIN_EMAIL,
        index: 0,
        private_keyshare: pair.decryption_key.toString(),
      }),
    )

    // Save pub key on election
    promises.push(election.update({ threshold_public_key }))

    await Promise.all(promises)

    // Send back election creation success
    return res.status(201).json({ threshold_public_key })
  }

  // Generate auth token for each trustee
  const auth_tokens = trustees.map(() => generateAuthToken())

  // Store auth tokens in db
  promises.push(
    Promise.all(
      trustees.map((trustee: string, index: number) =>
        election
          .collection('trustees')
          .doc(trustee)
          .set({ auth_token: auth_tokens[index], email: trustee, index }, { merge: true }),
      ),
    ),
  )

  // Email each trustee their auth token
  promises.push(
    Promise.all(
      trustees.map((trustee: string, index: number) => {
        if (trustee === ADMIN_EMAIL) return

        const link = `${req.headers.origin}/election/${election_id}/trustee?auth=${auth_tokens[index]}`

        return sendEmail({
          recipient: trustee,
          subject: `Trustee Invitation: ${election_title || `Election ${election_id}`}`,
          text: `Dear ${trustee},
<h3>You're invited to join a SIV Multiparty Key Generation${
            election_title ? `: ${election_title}` : ''
          }.</h3>This helps thoroughly anonymize election votes.
Each Trustee adds an extra layer of vote privacy.

Click here to join:
<a href="${link}" style="font-weight: bold;">${link}</a>

<em style="font-size:10px; opacity: 0.6;">This link is unique for you. Don't share it with anyone.</em>`,
        })
      }),
    ),
  )

  // Send Admin push notification
  promises.push(pushover(`Invited ${trustees.length} trustees`, trustees.join(', ')))

  // Generate admin's private coefficients and public commitments
  const private_coefficients = pick_private_coefficients(trustees.length, safe_prime_bigs)
  const commitments = generate_public_coefficients(private_coefficients, safe_prime_bigs)

  // Generate admins own keyshare for themselves
  const pairwise_shares_for = {
    [ADMIN_EMAIL]: evaluate_private_polynomial(
      1,
      private_coefficients,
      mapValues(safe_prime, (v) => big(v)),
    ).toString(),
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
          decryption_key: pair.decryption_key.toString(),
          pairwise_shares_for,
          private_coefficients: private_coefficients.map((c) => c.toString()),
          recipient_key: pair.public_key.recipient.toString(),
        },
        { merge: true },
      )
      .then(() => pusher.trigger('keygen', 'update', `${ADMIN_EMAIL} created their initial data`)),
  )

  await Promise.all(promises)

  // Finally, send http success back to frontend
  res.status(201).json({ election_id })
}
