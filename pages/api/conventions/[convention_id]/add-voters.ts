import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { generateAuthToken } from 'src/crypto/generate-auth-tokens'

import { firebase } from '../../_services'
import { checkJwtOwnsConvention } from '../../validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { convention_id } = req.query
  if (!convention_id || typeof convention_id !== 'string')
    return res.status(401).json({ error: `Missing convention_id` })

  const { numVoters } = req.body
  if (!numVoters || typeof numVoters !== 'number') return res.status(401).json({ error: `Missing numVoters` })

  // Confirm they created this convention
  const jwt = await checkJwtOwnsConvention(req, res, convention_id)
  if (!jwt.valid) return

  const doc = firebase.firestore().collection('conventions').doc(convention_id)

  const createdAt = new Date()

  // Insert new voters in DB
  const updateConventionDoc = doc.update({
    num_voters: firestore.FieldValue.increment(numVoters),
    voters: firestore.FieldValue.arrayUnion({ createdAt, number: numVoters }),
  })

  const { num_voters: prev_num_voters } = jwt
  const newSetIndex = jwt.voters?.length || 0

  // Assign unique voter_ids
  const createNewVoterIds = Array.from({ length: numVoters }, () => generateAuthToken()).map((voter_id, i) =>
    doc
      .collection('voter_ids')
      .doc(voter_id)
      .set({
        createdAt,
        index: i + prev_num_voters,
        setIndex: newSetIndex,
        voter_id,
      }),
  )

  await Promise.all(createNewVoterIds)
  await updateConventionDoc

  return res.status(201).send({ success: true })
}
