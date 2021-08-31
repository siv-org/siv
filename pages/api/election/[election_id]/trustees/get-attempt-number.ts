import { NextApiRequest, NextApiResponse } from 'next'
import { firebase } from 'pages/api/_services'

const { ADMIN_EMAIL } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query

  if (!ADMIN_EMAIL) return res.status(501).json({ error: 'Missing process.env.ADMIN_EMAIL' })

  const admin = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)
    .collection('trustees')
    .doc(ADMIN_EMAIL)

  // Is election_id in DB?
  const doc = await admin.get()
  if (!doc.exists) return res.status(400).send('Unknown Election ID.')

  const { keygen_attempt } = doc.data() as { keygen_attempt: number }

  return res.status(200).send(keygen_attempt)
}
