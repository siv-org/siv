import { NextApiRequest, NextApiResponse } from 'next'

import decrypt from '../../../../../src/crypto/decrypt'
import encrypt from '../../../../../src/crypto/encrypt'
import pickRandomInteger from '../../../../../src/crypto/pick-random-integer'
import { evaluate_private_polynomial, is_received_share_valid } from '../../../../../src/crypto/threshold-keygen'
import { big, bigCipher, bigPubKey, toStrings } from '../../../../../src/crypto/types'
import { State } from '../../../../../src/key-generation/keygen-state'
import { firebase } from '../../../_services'
import { pusher } from '../../../pusher'

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

  // Save whatever other new data they gave us
  await trusteeDoc.update({ ...body })

  // Notify all participants there's been an update
  pusher.trigger('keygen', 'update', `${email} updated ${Object.keys(body)}`)

  res.status(201).end(`Updated ${email} object`)

  // If they provided their public key, admin can now encrypt pairwise shares for them.
  // If they provided encrypted shares, admin can decrypt their own and verify them.
  if (body.recipient_key || body.encrypted_pairwise_shares) {
    // Get admin's private data
    const adminDoc = electionDoc.collection('trustees').doc(ADMIN_EMAIL)
    const admin = { ...(await adminDoc.get()).data() } as Required<State> & {
      decryption_key: string
      recipient_key: string
    }
    const {
      decrypted_shares,
      decryption_key,
      encrypted_pairwise_shares,
      pairwise_randomizers,
      pairwise_shares,
      private_coefficients: coeffs,
      recipient_key,
      verifications,
    } = admin

    // Get election parameters
    const parameters = { ...election.data() }
    const big_parameters = { g: big(parameters.g), p: big(parameters.p), q: big(parameters.q) }

    // Which index are we editing?
    const { index } = trustee

    // Logic for new recipient_key
    if (body.recipient_key) {
      // Calculate admin's pairwise share for this trustee
      pairwise_shares[index] = evaluate_private_polynomial(
        index + 1,
        coeffs.map((c) => big(c)),
        big_parameters,
      ).toString()

      // Encrypt the pairwise shares for the target recipients eyes only...

      // First we pick a randomizer
      pairwise_randomizers[index] = pickRandomInteger(big(parameters.p)).toString()

      // Then we encrypt
      encrypted_pairwise_shares[index] = toStrings(
        encrypt(
          bigPubKey({ generator: parameters.g, modulo: parameters.p, recipient: body.recipient_key }),
          big(pairwise_randomizers[index]),
          big(pairwise_shares[index]),
        ),
      )

      // Store all the new data we created
      await adminDoc.update({ encrypted_pairwise_shares, pairwise_randomizers, pairwise_shares })

      // Notify all participants there's been an update
      pusher.trigger('keygen', 'update', `${ADMIN_EMAIL} updated encrypted_pairwise_shares ${trustee.index}`)
    }

    // Logic for new encrypted shares
    if (body.encrypted_pairwise_shares) {
      // Decrypt the share for admin
      const decrypted_share = decrypt(
        bigPubKey({
          generator: parameters.g,
          modulo: parameters.p,
          recipient: recipient_key,
        }),
        big(decryption_key),
        bigCipher(JSON.parse(body.encrypted_pairwise_shares[0])),
      )
      decrypted_shares[index] = decrypted_share

      // Verify the received share
      verifications[index] = is_received_share_valid(big(decrypted_share), 1, trustee.commitments, big_parameters)

      // Store all the new data we created
      await adminDoc.update({ decrypted_shares, verifications })

      // Notify all participants there's been an update
      pusher.trigger('keygen', 'update', `${ADMIN_EMAIL} updated verifications ${trustee.index}`)
    }
  }
}
