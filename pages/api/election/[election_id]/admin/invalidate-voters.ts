import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'
import { Voter } from './load-admin'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }
  const { voters_to_invalidate } = req.body as { voters_to_invalidate: Voter[] }

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  await Promise.all(
    voters_to_invalidate.map(async (voter) => {
      const db = firebase.firestore()
      const voterRef = db.collection('elections').doc(election_id).collection('voters').doc(voter.email)

      return Promise.all([
        voterRef.update({ invalidated_at: new Date() }),
        invalidateVotes(election_id, voter.auth_token),
        sendEmail(voter.email),
      ])
    }),
  )

  return res.status(201).json({ message: 'Done' })
}

async function invalidateVotes(election_id: string, auth: string) {
  const db = firebase.firestore()
  const votes = await db.collection('elections').doc(election_id).collection('votes').where('auth', '==', auth).get()

  await Promise.all(
    votes.docs.map(async (vote) => {
      const invalidatedVote = { ...vote.data(), invalidated_at: new Date() }
      await db
        .collection('elections')
        .doc(election_id)
        .collection('invalidated_votes')
        .doc(vote.id)
        .set(invalidatedVote)
      await vote.ref.delete()
    }),
  )
}

function sendEmail(voter: string) {
  console.log(`Sending email to voter: ${voter}`) // Replace this with actual code to send email
}
