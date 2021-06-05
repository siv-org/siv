import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, sendEmail } from './_services'
import { generateAuthToken } from './invite-voters'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email }: { email: string } = req.body

  // Confirm they sent a valid email address
  if (!email) return res.status(400).send('Missing email')
  if (!email.includes('@') || !email.includes('.')) return res.status(400).send('Malformed')

  // Is this email an approved election manager?
  const adminDoc = await firebase.firestore().collection('admins').doc(email)

  // Store 'failed-logins' in db
  if (!(await adminDoc.get()).exists) {
    await firebase
      .firestore()
      .collection('failed-logins')
      .doc(email)
      .set({ failed_at: firestore.FieldValue.arrayUnion(new Date()) }, { merge: true })
    return res.status(404).send(`'${email}' is not approved election manager`)
  }

  // Otherwise trigger their login email...

  // First we'll make & store a login auth token for them.
  const auth_token = generateAuthToken()
  adminDoc.collection('logins').doc(new Date().toISOString()).set({ auth_token, created_at: new Date() })

  const link = `${req.headers.origin}/admin?auth=${auth_token}`
  sendEmail({
    recipient: email,
    subject: 'SIV Admin Login',
    text: `A request was made to access your SIV Admin Dashboard.
<h3>Click here to login: <a href="${link}">${link}</a></h3>

<em style="font-size:10px; opacity: 0.6;">If you did not authorize this request, please reply to let us know.</em>`,
  })

  res.status(200).send('Success')
}
