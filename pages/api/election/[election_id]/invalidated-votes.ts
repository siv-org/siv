import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query

  const electionDoc = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin preloading
  const loadInvalidatedVotes = electionDoc.collection('invalidated_votes').get()

  // Is election_id in DB?
  if (!(await electionDoc.get()).exists) return res.status(400).json({ error: 'Unknown Election ID.' })

  // Grab public votes fields including encrypted_vote
  const votes = (await loadInvalidatedVotes).docs.map((doc) => {
    const { auth, encrypted_vote } = doc.data()
    return {
      auth,
      encrypted_vote,
    }
  })

  res.status(200).json(votes)
}
