import { firestore } from 'firebase-admin'
import { pick } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'

import { Trustee } from '../../../../../src/key-generation/keygen-state'
import { firebase } from '../../../_services'
import { pusher } from '../../../pusher'

const { ADMIN_EMAIL } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!ADMIN_EMAIL) return res.status(501).end('Missing process.env.ADMIN_EMAIL')

  const { election_id } = req.query
  const { email, trustee_auth } = req.body

  if (!email) return res.status(404)
  if (!email.endsWith('dsernst.com')) return res.status(401)

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

  const all_trustee_initial_fields = ['auth_token', 'index', 'email']

  // Delete election threshold_pub_key
  const reset_pub_key = electionDoc.update({ threshold_public_key: firestore.FieldValue.delete() })

  // Reset db info about Admin
  const reset_admin = async () => {
    const adminDoc = electionDoc.collection('trustees').doc(ADMIN_EMAIL)
    const admin = (await adminDoc.get()).data()

    const admin_initial_fields = [
      'recipient_key',
      'decryption_key',
      'private_coefficients',
      'pairwise_shares_for',
      'commitments',
    ]

    const cleaned = pick(admin, [...all_trustee_initial_fields, ...admin_initial_fields])

    // Keep admins own decrypted_share for themselves
    cleaned.decrypted_shares_from = pick(admin?.decrypted_shares_from, ADMIN_EMAIL)

    return adminDoc.set(cleaned)
  }

  // Reset db info about other trustees
  const reset_other_trustees = async () => {
    // Get all trustees
    const trustees: Trustee[] = []
    ;(await electionDoc.collection('trustees').get()).forEach((doc) => trustees.push({ ...doc.data() } as Trustee))

    return Promise.all(
      trustees.map((t) => {
        // Skip admin, we're resetting them separately
        if (t.email === ADMIN_EMAIL) return

        const cleaned = pick(t, all_trustee_initial_fields)

        return electionDoc.collection('trustees').doc(t.email).set(cleaned)
      }),
    )
  }

  await Promise.all([reset_pub_key, reset_admin(), reset_other_trustees()])

  res.status(204).end()

  // Notify all participants to reset
  pusher.trigger('keygen', 'reset', `${email} trigged reset`)
}
