import { NextApiRequest, NextApiResponse } from 'next'

import encrypt from '../../../../../src/crypto/encrypt'
import pickRandomInteger from '../../../../../src/crypto/pick-random-integer'
import { evaluate_private_polynomial } from '../../../../../src/crypto/threshold-keygen'
import { big, bigPubKey, toStrings } from '../../../../../src/crypto/types'
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
  if (body.recipient_key) {
    // Get admin's private data
    const adminDoc = electionDoc.collection('trustees').doc(ADMIN_EMAIL)
    const admin = { ...(await adminDoc.get()).data() } as Required<State>
    const { encrypted_pairwise_shares, pairwise_randomizers, pairwise_shares, private_coefficients: coeffs } = admin

    // Get election parameters
    const parameters = { ...election.data() }

    // Which index are we editing?
    const { index } = trustee

    // Calculate admin's pairwise share for this trustee
    pairwise_shares[index] = evaluate_private_polynomial(
      index + 1,
      coeffs.map((c) => big(c)),
      { g: big(parameters.g), p: big(parameters.p), q: big(parameters.q) },
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
}
