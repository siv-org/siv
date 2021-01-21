import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

import { Trustee } from '../../../../../src/trustee/trustee-state'
import { firebase } from '../../../_services'
import { pusher } from '../../../pusher'

const { ADMIN_EMAIL } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!ADMIN_EMAIL) return res.status(501).json({ error: 'Missing process.env.ADMIN_EMAIL' })

  const { election_id } = req.query
  const { email, trustee_auth } = req.body

  if (!email) return res.status(404)
  if (!email.endsWith('dsernst.com')) return res.status(401).json({ error: 'Not authorized to reset keygen' })

  const electionDoc = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin preloading these docs
  const trusteeDoc = electionDoc.collection('trustees').doc(email)
  const loadTrustee = trusteeDoc.get()
  const loadTrustees = electionDoc.collection('trustees').get()

  // Is election_id in DB?
  const election = await electionDoc.get()
  if (!election.exists) return res.status(400).json({ error: 'Unknown Election ID.' })

  // Grab claimed trustee
  const trustee = { ...(await loadTrustee).data() }

  // Authenticate by checking if trustee_auth token matches
  if (trustee.auth_token !== trustee_auth) return res.status(401).json({ error: 'Bad trustee_auth token' })

  // Delete election decrypted
  const reset_decrypted = electionDoc.update({ decrypted: firestore.FieldValue.delete() })

  // Reset all trustee's shuffled & partials
  const reset_trustees = async () => {
    // Get all trustees
    const trustees: Trustee[] = []
    ;(await loadTrustees).forEach((doc) => trustees.push({ ...doc.data() } as Trustee))

    return Promise.all(
      trustees.map((t) => {
        return electionDoc.collection('trustees').doc(t.email).update({
          partials: firestore.FieldValue.delete(),
          shuffled: firestore.FieldValue.delete(),
        })
      }),
    )
  }

  await Promise.all([reset_decrypted, reset_trustees()])
  const success_msg = `Successfully reset db for election/${election_id}/close`
  console.log(success_msg)

  // Notify all participants to reset
  await pusher.trigger('keygen', 'reset-close', `${email} trigged reset`)

  res.status(204).json({ message: success_msg })
}
