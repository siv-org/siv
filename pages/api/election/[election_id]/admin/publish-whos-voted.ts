import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'

import { checkJwtOwnsElection } from '../../../validate-admin-jwt'

type PublicWhosVotedRow = { display_name?: string; has_voted: boolean }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  // Load voters + votes + invalidations
  const loadVoters = electionDoc.collection('voters').get()
  const loadVotes = electionDoc.collection('votes').select('auth').get()
  const loadInvalidatedVotes = electionDoc.collection('invalidated_votes').select('auth').get()

  const votesByAuth = (await loadVotes).docs.reduce((acc, doc) => ({ ...acc, [doc.data().auth]: true }), {} as Record<
    string,
    true
  >)

  const invalidatedByAuth = (await loadInvalidatedVotes).docs.reduce(
    (acc, doc) => ({ ...acc, [doc.data().auth]: true }),
    {} as Record<string, true>,
  )

  const snapshot: PublicWhosVotedRow[] = (await loadVoters).docs.map((doc) => {
    const { auth_token, display_name } = doc.data() as { auth_token?: string; display_name?: string }
    const has_voted = !!(auth_token && (votesByAuth[auth_token] || invalidatedByAuth[auth_token]))
    return { ...(display_name ? { display_name } : {}), has_voted }
  })

  await electionDoc.update({ public_whos_voted_snapshot: snapshot })

  return res.status(201).json({ count: snapshot.length, message: 'Published whos voted snapshot' })
}

