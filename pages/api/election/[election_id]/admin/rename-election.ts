import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover } from '../../../_services'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id?: string }
  if (!election_id) return res.status(401).json({ error: `Missing election_id` })

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  const { new_title } = req.body

  // Validate the new title
  if (!new_title || typeof new_title !== 'string' || new_title.trim().length === 0)
    return res.status(400).json({ error: 'New title is required and must be a non-empty string' })

  const trimmedTitle = new_title.trim()

  await Promise.all([
    // Send admin notif that they're using this beta endpoint
    pushover(
      `${jwt.election_manager} renamed election ${election_id}`,
      `OLD: ${jwt.election_title}\nNEW: ${new_title}\n\nNum Votes: ${jwt.num_votes}`,
    ),

    // Update the election title in Firestore
    firebase
      .firestore()
      .collection('elections')
      .doc(election_id)
      .update({
        election_title: trimmedTitle,
        prev_election_titles: firestore.FieldValue.arrayUnion({
          edited_at: new Date(),
          prev_title: jwt.election_title,
        }),
      }),
  ])

  return res.status(200).json({ election_title: trimmedTitle, success: true })
}
