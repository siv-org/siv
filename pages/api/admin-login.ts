import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from './_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email }: { email: string } = req.body

  // Confirm they sent a valid email address
  if (!email) return res.status(400).send('Missing email')
  if (!email.includes('@') || !email.includes('.')) return res.status(400).send('Malformed')

  // Is this email an approved election manager?
  const adminDoc = await firebase.firestore().collection('admins').doc(email).get()

  // Store 'failed-logins' in db
  if (!adminDoc.exists) {
    await firebase
      .firestore()
      .collection('failed-logins')
      .doc(email)
      .set({ failed_at: firestore.FieldValue.arrayUnion(new Date()) }, { merge: true })
    return res.status(404).send(`'${email}' is not approved election manager`)
  }

  // TODO: Otherwise trigger their login email

  res.status(200).send('Success')
}
