import bluebird from 'bluebird'
import { NextApiRequest, NextApiResponse } from 'next'
import { firebase } from 'pages/api/_services'
import { checkJwtOwnsElection } from 'pages/api/validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query

  if (!election_id || typeof election_id !== 'string') return res.status(400).json({ error: 'Missing election_id' })

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  // Don't delete if not from e2e tester
  if (jwt.email !== 'e2e-tester@siv.org') return res.status(403).json({ error: 'Can only delete test elections' })

  const doc = firebase.firestore().collection('elections').doc(election_id)

  // First delete the subcollection
  await bluebird.map(['trustees', 'voters', 'votes'], async (collection) => {
    // Get then delete all docs in the collection
    const trusteeDocs = (await doc.collection(collection).get()).docs
    return { [collection]: await bluebird.map(trusteeDocs, (doc) => doc.ref.delete()) }
  })

  // Delete the election
  await doc.delete()

  res.status(201).json({ message: 'success' })
}
