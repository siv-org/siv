import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import { secretsMatch } from 'src/_shared/secretsMatch'

import { firebase, pushover } from './_services'
import { setJWT } from './admin-check-login-code'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.body
  let { email } = req.body

  if (!code || !email) return res.status(400).json({ error: 'Missing required params' })
  email = email.toLowerCase()

  // Look up admin in DB
  const adminDoc = firebase.firestore().collection('admins').doc(email)
  const admin = await adminDoc.get()

  // Not approved?
  if (!admin.exists) return res.status(204).json({ message: 'Not an approved admin' })

  const { approved_at, init_login_code, name } = { ...admin.data() } as {
    approved_at?: { toDate: () => Date }
    init_login_code?: string
    name?: string
  }

  // Don't have init_login_code?
  if (!init_login_code) return res.status(206).json({ message: 'Approved, but need to verify email' })

  // Same 60 min window as /admin-check-login-code
  const minutes_since = approved_at ? (Date.now() - Number(approved_at.toDate())) / 60_000 : Infinity
  if (minutes_since > 60) {
    await adminDoc.update({ init_login_code: firestore.FieldValue.delete() })
    return res.status(412).json({ error: 'Expired login code' })
  }

  // Incorrect code?
  if (!secretsMatch(init_login_code, code)) {
    await pushover('Invalid admin-use-init-code', JSON.stringify({ code, email }))
    return res.status(401).json({ message: 'Incorrect code' })
  }

  // Success
  await adminDoc.update({ init_login_code: firestore.FieldValue.delete() }) // single-use only
  setJWT({ email, name, req, res })

  return res.status(200).send({ message: 'Success! Setting jwt cookie.' })
}
