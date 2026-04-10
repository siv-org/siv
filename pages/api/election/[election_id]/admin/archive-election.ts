import { firebase, pushover } from 'api/_services'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

import { checkJwtOwnsElection } from '../../../validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id?: string }
  if (!election_id) return res.status(401).json({ error: `Missing election_id` })

  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  const body = (typeof req.body === 'object' && req.body) || {}
  const unarchive = (body as { unarchive?: boolean }).unarchive === true

  if (unarchive) {
    await Promise.all([
      pushover(
        `${jwt.election_manager} unarchived election ${election_id}`,
        `${jwt.election_title}\n\nNum Votes: ${jwt.num_votes}`,
      ),
      firebase
        .firestore()
        .collection('elections')
        .doc(election_id)
        .update({ archived_at: firestore.FieldValue.delete() }),
    ])
  } else {
    await Promise.all([
      pushover(
        `${jwt.election_manager} archived election ${election_id}`,
        `${jwt.election_title}\n\nNum Votes: ${jwt.num_votes}`,
      ),
      firebase.firestore().collection('elections').doc(election_id).update({ archived_at: new Date() }),
    ])
  }

  return res.status(200).json({ success: true })
}
