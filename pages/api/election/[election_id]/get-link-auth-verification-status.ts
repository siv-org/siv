import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }
  const { link_auth } = req.body

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const vote = await electionDoc.collection('votes-pending').doc(link_auth).get()

  // Is there a vote w/ this link_auth token?
  if (!vote.exists) return res.status(200).send('Unverified')

  // Has it verified?
  if (vote.data()?.is_email_verified) return res.status(200).send('Verified')

  // Must still be pending application
  return res.status(200).send('Unverified')
}
