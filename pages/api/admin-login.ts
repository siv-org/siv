import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { pick_random_bigint } from 'src/crypto/pick-random-bigint'

import { firebase, sendEmail } from './_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let { email }: { email: string } = req.body

  // Confirm they sent a valid email address
  if (!email) return res.status(400).send('Missing email')
  if (!email.includes('@') || !email.includes('.')) return res.status(400).send('Malformed')
  email = email.toLowerCase()

  // Is this email an approved election manager?
  const adminDoc = firebase.firestore().collection('admins').doc(email)

  // Store 'failed-logins' in db
  if (!(await adminDoc.get()).exists) {
    await firebase
      .firestore()
      .collection('failed-logins')
      .doc(email)
      .set({ failed_at: firestore.FieldValue.arrayUnion(new Date()) }, { merge: true })
    return res.status(404).send(`'${email}' is not approved election manager`)
  }

  // return res.status(200).send('Success, but not sending emails') // DEBUG ONLY
  // Otherwise trigger their login email...

  // First we'll make & store a login code for them.
  const login_code = generateAdminLoginCode()
  adminDoc.collection('logins').doc(new Date().toISOString()).set({ created_at: new Date(), login_code })

  const link = `${req.headers.origin}/admin?email=${email}&code=${login_code}`
  await sendEmail({
    from: 'Secure Internet Voting',
    recipient: email,
    subject: 'SIV Admin Login',
    text: `A request was made to access your SIV Admin Dashboard.

You can enter this code: ${login_code}

${button(link, 'Or Click Here to Login Directly')}

<em style="font-size:10px; opacity: 0.6;">If you did not authorize this request, press reply to let us know.</em>`,
  })

  res.status(200).send('Success')
}

/** Pick a cryptographically-secure random number
 * greater than 100,000
 * less than 999,999.
 */
export const generateAdminLoginCode = () =>
  (pick_random_bigint(BigInt(900_000)) + BigInt(100_000)).toString().slice(0, 6)

const button = (link: string, text: string) =>
  `<table width="100%" cellspacing="0" cellpadding="0"><tr><td align="center"><table cellspacing="0" cellpadding="0"><tr><td style="border-radius: 8px;" bgcolor="#072054"><a href="${link}" target="_blank" style="padding: 8px 22px; border: 1px solid #072054;border-radius: 8px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">${text}</a></td></tr></table></td></tr></table>`
