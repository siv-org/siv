import { sumBy } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'

import decrypt from '../../../../../src/crypto/decrypt'
import encrypt from '../../../../../src/crypto/encrypt'
import pickRandomInteger from '../../../../../src/crypto/pick-random-integer'
import {
  compute_keyshare,
  compute_pub_key,
  evaluate_private_polynomial,
  is_received_share_valid,
  partial_decrypt,
} from '../../../../../src/crypto/threshold-keygen'
import { big, bigCipher, bigPubKey, toStrings } from '../../../../../src/crypto/types'
import { State, Trustee } from '../../../../../src/key-generation/keygen-state'
import { firebase } from '../../../_services'
import { pusher } from '../../../pusher'
import { commafy, transform_email_keys } from './commafy'

const { ADMIN_EMAIL } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!ADMIN_EMAIL) return res.status(501).end('Missing process.env.ADMIN_EMAIL')

  const { election_id } = req.query
  const { body } = req
  const { email, trustee_auth } = body

  if (!email) return res.status(404)

  const electionDoc = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Is election_id in DB?
  const election = await electionDoc.get()
  if (!election.exists) return res.status(400).end('Unknown Election ID.')

  // Grab claimed trustee
  const trusteeDoc = electionDoc.collection('trustees').doc(email)
  const trustee = { ...(await trusteeDoc.get()).data() }

  // Authenticate by checking if trustee_auth token matches
  if (trustee.auth_token !== trustee_auth) return res.status(401).end('Bad trustee_auth token')

  // Remove email & trustee_auth from body obj
  delete body.email
  delete body.trustee_auth

  // Escape object keys w/ periods into commas
  // (Firebase doesn't like dots in keys)
  const commafied = transform_email_keys(body, 'commafy')

  // Save whatever other new data they gave us
  await trusteeDoc.update(commafied)

  // Notify all participants there's been an update
  pusher.trigger('keygen', 'update', `${email} updated ${Object.keys(body)}`)

  res.status(201).end(`Updated ${email} object`)

  // If they provided their public key, admin can now encrypt pairwise shares for them.
  // If they provided encrypted shares, admin can decrypt their own and verify them.
  if (body.recipient_key || body.encrypted_pairwise_shares_for) {
    // Get admin's private data
    const adminDoc = electionDoc.collection('trustees').doc(ADMIN_EMAIL)
    const admin = { ...(await adminDoc.get()).data() } as Required<State> & {
      decryption_key: string
      recipient_key: string
    }
    const { decryption_key, private_coefficients, recipient_key } = admin

    // Get election parameters
    const parameters = { ...election.data() }
    const big_parameters = { g: big(parameters.g), p: big(parameters.p), q: big(parameters.q) }

    // Logic for new recipient_key
    if (body.recipient_key) {
      // Calculate admin's pairwise share for this trustee
      const pairwise_share = evaluate_private_polynomial(
        trustee.index + 1,
        private_coefficients.map((c) => big(c)),
        big_parameters,
      ).toString()

      // Encrypt the pairwise shares for the target recipients eyes only...

      // First we pick a randomizer
      const pairwise_randomizer = pickRandomInteger(big(parameters.p)).toString()

      // Then we encrypt
      const encrypted_pairwise_share = toStrings(
        encrypt(
          bigPubKey({ generator: parameters.g, modulo: parameters.p, recipient: body.recipient_key }),
          big(pairwise_randomizer),
          big(pairwise_share),
        ),
      )

      // Store all the new data we created
      await adminDoc.update({
        [`encrypted_pairwise_shares_for.${commafy(email)}`]: encrypted_pairwise_share,
        [`pairwise_randomizers_for.${commafy(email)}`]: pairwise_randomizer,
        [`pairwise_shares_for.${commafy(email)}`]: pairwise_share,
      })

      // Notify all participants there's been an update
      pusher.trigger('keygen', 'update', `${ADMIN_EMAIL} updated encrypted_pairwise_shares_for ${email}`)
    }

    // Logic for new encrypted shares
    if (body.encrypted_pairwise_shares_for) {
      let encrypted
      try {
        encrypted = JSON.parse(body.encrypted_pairwise_shares_for[ADMIN_EMAIL])
      } catch (e) {
        return console.error(`Error parsing encrypted share from ${email} for admin`, e)
      }
      // Decrypt the share for admin
      const decrypted_share = decrypt(
        bigPubKey({
          generator: parameters.g,
          modulo: parameters.p,
          recipient: recipient_key,
        }),
        big(decryption_key),
        bigCipher(encrypted),
      )

      // Verify the received share
      const verification = is_received_share_valid(big(decrypted_share), 1, trustee.commitments, big_parameters)

      // Store all the new data we created
      await adminDoc.update({
        [`decrypted_shares_from.${commafy(email)}`]: decrypted_share,
        [`verified.${commafy(email)}`]: verification,
      })

      // Notify all participants there's been an update
      pusher.trigger('keygen', 'update', `${ADMIN_EMAIL} updated verification for ${email}`)

      // If admin has verified all shares, they can now (1) calculate their own private keyshare, (2) the public threshold key, and (3) encrypt and then (4) partially decrypt a test message.

      // Get latest admin data
      const adminLatest = { ...(await adminDoc.get()).data() } as State
      const numPassed = sumBy(Object.values(adminLatest.verified || {}), Number)
      const numExpected = parameters.t - 1
      // Stop if not enough have passed yet
      if (!numPassed || numPassed !== numExpected) return

      const incoming_bigs = Object.values(adminLatest.decrypted_shares_from || {}).map((n) => big(n))

      // (1) Calculate admins private keyshare
      const private_keyshare = compute_keyshare(incoming_bigs, big_parameters.q).toString()

      // Get all trustees
      const trustees: Trustee[] = []
      ;(await electionDoc.collection('trustees').get()).forEach((doc) => trustees.push({ ...doc.data() } as Trustee))
      const constant_commitments = trustees.map((t) => big(t.commitments[0]))

      // (2) Calculate & store public threshold key
      const threshold_public_key = compute_pub_key(constant_commitments, big_parameters.p).toString()
      await electionDoc.update({ threshold_public_key })

      // (3) Encrypt test message
      const randomizer = '108'
      const unlock = big_parameters.g.modPow(big(randomizer), big_parameters.p)

      // (4) Partially decrypt test message
      const partial_decryption = partial_decrypt(unlock, big(private_keyshare), big_parameters).toString()

      // Store admin's private_keyshare & partial_decryption
      await adminDoc.update({ partial_decryption, private_keyshare })

      // Notify all participants there's been an update
      pusher.trigger('keygen', 'update', `${ADMIN_EMAIL} updated partial_decryption`)
    }
  }
}
