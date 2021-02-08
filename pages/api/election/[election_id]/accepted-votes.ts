import { NextApiRequest, NextApiResponse } from 'next'

import { getStatus } from '../../../../src/admin/Voters/Signature'
import { firebase } from '../../_services'
import { ReviewLog } from './admin/load-admin'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query

  const electionDoc = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin preloading
  const loadVotes = electionDoc.collection('votes').orderBy('created_at').get()
  const loadVoters = electionDoc.collection('voters').get()

  // Is election_id in DB?
  if (!(await electionDoc.get()).exists) return res.status(400).json({ error: 'Unknown Election ID.' })

  type VotersByAuth = Record<string, { esignature_review: ReviewLog[] }>
  const votersByAuth: VotersByAuth = (await loadVoters).docs.reduce((acc: VotersByAuth, doc) => {
    const data = doc.data()
    return { ...acc, [data.auth_token]: data }
  }, {})

  // Grab public votes fields
  const votes = (await loadVotes).docs.map((doc) => {
    const { auth, encrypted_vote } = doc.data()
    return {
      auth,
      ...encrypted_vote,
      signature_approved: getStatus(votersByAuth[auth].esignature_review) === 'approve',
    }
  })

  res.status(200).json(votes)
}
