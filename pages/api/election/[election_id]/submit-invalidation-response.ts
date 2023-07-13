import { firebase, sendEmail } from 'api/_services'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { auth, message } = req.body
  const { election_id } = req.query

  const election = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin preloading
  const electionDoc = election.get()
  const loadVoters = election.collection('voters').where('auth_token', '==', auth).get()

  // Store in database on the invalidated_vote doc
  const votes = await election.collection('invalidated_votes').where('auth', '==', auth).get()
  await Promise.all(
    votes.docs.map((vote) =>
      vote.ref.update({ responses: firestore.FieldValue.arrayUnion({ message, timestamp: new Date() }) }),
    ),
  )

  // Send admin email
  const voter = (await loadVoters).docs[0].data()
  const electionData = (await electionDoc).data()

  sendEmail({
    bcc: 'admin@siv.org',
    recipient: electionData?.creator,
    subject: 'Invalidated Vote: Voter Response',
    text: `You have received a message from a voter whose vote you invalidated.

    Election Title: ${electionData?.election_title}
    Election ID: ${election_id}

    Voter details:
    - Auth token: ${voter.auth_token}
    - Email: ${voter.email}
    - First Name: ${voter.first_name || 'Not provided'}
    - Last Name:  ${voter.last_name || 'Not provided'}

    Their message below:

    <hr />
    
    ${message}
    `,
  })

  res.status(200).json({ message: 'Message received' })
}
