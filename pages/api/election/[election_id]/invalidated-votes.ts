import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'

type InvalidatedVote = { auth: string; encrypted_vote: Record<string, { encrypted: string; lock: string }> }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query

  const electionDoc = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin preloading
  const loadInvalidatedVotes = electionDoc.collection('approved-voters').where('invalidated_at', '!=', null).get()

  // Is election_id in DB?
  if (!(await electionDoc.get()).exists) return res.status(400).json({ error: 'Unknown Election ID.' })

  // Grab public votes fields including encrypted_vote
  const invalidated_votes = (await loadInvalidatedVotes).docs.reduce((memo, doc) => {
    const { auth_token, encrypted_vote } = doc.data()
    // Filter for only docs where they voted
    // (would be a bit more efficient to do this at the DB query layer, but Firebase only allows one NOT_EQUAL filter per query)
    if (encrypted_vote) memo.push({ auth: auth_token, encrypted_vote })

    return memo
  }, [] as InvalidatedVote[])

  res.status(200).json(invalidated_votes)
}
