import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from './_services'

const JWT_SECRET = 'foobar'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { auth, email }: { auth: string; email: string } = req.body

  // Is this email an approved election manager?
  const adminDoc = firebase.firestore().collection('admins').doc(email)
  if ((await adminDoc.get()).exists) {
    // Is this a valid auth token for them?
    const [session] = (await adminDoc.collection('logins').where('auth_token', '==', auth).get()).docs
    if (session) {
      // Is the session within the last 30 minutes?
      const { created_at } = { ...session.data() } as { created_at: { toDate: () => Date } }
      const date = created_at.toDate()
      const diff = Number(new Date()) - Number(date)
      const minutes_since = diff / 1000 / 60
      if (minutes_since < 30) {
        // Valid session
        return res.status(200).send({ jwt: jwt.sign({ email }, JWT_SECRET) })
      } else {
        // Expired session
        return res.status(412).send({ error: 'Expired session' })
      }
    }
  }

  return res.status(401).send({ error: `Invalid login token` })
}
