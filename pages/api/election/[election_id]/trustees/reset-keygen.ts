import { firestore } from 'firebase-admin'
import { pick } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'
import { firebase } from 'pages/api/_services'
import { pusher } from 'pages/api/pusher'
import { Trustee } from 'src/trustee/trustee-state'

const { ADMIN_EMAIL } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!ADMIN_EMAIL) return res.status(501).json({ error: 'Missing process.env.ADMIN_EMAIL' })

  const { election_id } = req.query
  const { auth, email } = req.body

  if (!email) return res.status(404)
  if (!('david@secureinternetvoting.org' === email || email.includes('@dsernst.com')))
    return res.status(401).json({ error: 'Not authorized to reset keygen' })

  const electionDoc = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin preloading these docs
  const trusteeDoc = electionDoc.collection('trustees').doc(email)
  const adminDoc = electionDoc.collection('trustees').doc(ADMIN_EMAIL)
  const loadTrustee = trusteeDoc.get()
  const loadAdmin = adminDoc.get()
  const loadTrustees = electionDoc.collection('trustees').get()

  // Is election_id in DB?
  const election = await electionDoc.get()
  if (!election.exists) return res.status(400).json({ error: 'Unknown Election ID.' })

  // Grab claimed trustee
  const trustee = { ...(await loadTrustee).data() }

  // Authenticate by checking if auth token matches
  if (trustee.auth_token !== auth) return res.status(401).json({ error: 'Bad auth token' })

  const all_trustee_initial_fields = ['auth_token', 'index', 'email', 'name', 'mailgun_events', 'email_edits']

  // Delete election threshold_pub_key
  const reset_pub_key = electionDoc.update({ threshold_public_key: firestore.FieldValue.delete() })

  // Reset db info about Admin
  const reset_admin = async () => {
    const admin = (await loadAdmin).data()

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

    return adminDoc.set({
      ...cleaned,
      keygen_attempt: 1 + admin?.keygen_attempt,
      previous_keygen_attempt: [admin, ...(admin?.previous_keygen_attempt || [])],
    })
  }

  // Reset db info about other trustees
  const reset_other_trustees = async () => {
    // Get all trustees
    const trustees: Trustee[] = []
    ;(await loadTrustees).forEach((doc) => trustees.push({ ...doc.data() } as Trustee))

    return Promise.all(
      trustees.map((t) => {
        // Skip admin, we're resetting them separately
        if (t.email === ADMIN_EMAIL) return

        const cleaned = pick(t, all_trustee_initial_fields)

        return electionDoc
          .collection('trustees')
          .doc(t.email)
          .set({ ...cleaned, previous_keygen_attempt: firestore.FieldValue.arrayUnion(t) })
      }),
    )
  }

  await Promise.all([reset_pub_key, reset_admin(), reset_other_trustees()])
  const success_msg = `Successfully reset db for election/${election_id}/keygen`
  console.log(success_msg)

  // Notify all participants to reset
  await pusher.trigger(`keygen-${election_id}`, 'reset-keygen', `${email} trigged reset`)

  res.status(204).send(success_msg)
}
