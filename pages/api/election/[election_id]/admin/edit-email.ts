import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'

const { ADMIN_PASSWORD } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { new_email, old_email, password } = req.body
  if (new_email === old_email) return res.status(401).json({ error: 'new_email must be different from old_email' })

  const { election_id } = req.query as { election_id: string }

  // Check password
  if (!ADMIN_PASSWORD) return res.status(501).json({ error: 'Missing process.env.ADMIN_PASSWORD' })
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid Password.' })

  const votersCollection = firebase.firestore().collection('elections').doc(election_id).collection('voters')

  // Get old voter data
  const old_voter_doc = await votersCollection.doc(old_email).get()
  if (!old_voter_doc.exists) return res.status(401).json({ error: `Can't find voter ${old_email}` })
  const old_voter_data = { ...old_voter_doc.data() }
  old_voter_data.email = new_email

  // Confirm new voter doesn't already exist
  if ((await votersCollection.doc(new_email).get()).exists)
    return res.status(401).json({ error: `There's already a voter ${new_email}` })

  // TODO: Validate new_email is a valid email address

  // Store record of edit on new voter
  old_voter_data.email_edits = [...(old_voter_data.email_edits || []), { edited_at: new Date(), email: old_email }]

  // Delete the old voter and move its data to new_email
  await Promise.all([votersCollection.doc(old_email).delete(), votersCollection.doc(new_email).set(old_voter_data)])

  return res.status(201).json({ message: 'Changed email' })
}
