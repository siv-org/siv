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
  const voterDoc = election.collection('approved-voters').doc(auth)
  const voter = await voterDoc.get()
  if (!voter.exists) return res.status(404).json({ error: 'No voter w/ this auth_token: ' + auth })

  // Store in database on the invalidated_vote doc
  voterDoc.update({ invalidated_vote_reply: firestore.FieldValue.arrayUnion({ message, timestamp: new Date() }) })

  // Send admin email
  const { email, first_name, last_name } = voter.data() || {}
  const electionData = (await electionDoc).data()

  sendEmail({
    bcc: 'admin@siv.org',
    recipient: electionData?.creator,
    subject: `Invalidated Vote: Voter Response from ${email}`,
    text: `You have received a message from a voter whose vote you invalidated.

    Election Title: ${electionData?.election_title}
    Election ID: ${election_id}

    Voter details:
    - Auth token: ${auth}
    - Email: ${email}
    - First Name: ${first_name || 'Not provided'}
    - Last Name:  ${last_name || 'Not provided'}

    Their message below:

    <hr />
    
    ${message}
    `,
  })

  res.status(200).json({ message: 'Message received' })
}
