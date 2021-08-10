import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover } from './_services'
import { setJWT } from './admin-check-login-code'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, email } = req.body

  if (!code || !email) return res.status(400).json({ error: 'Missing required params' })

  // Look up admin in DB
  const adminDoc = firebase.firestore().collection('admins').doc(email)
  const admin = await adminDoc.get()

  // Not approved?
  if (!admin.exists) return res.status(204).json({ message: 'Not an approved admin' })

  const { init_login_code, name } = { ...admin.data() } as { init_login_code?: string; name?: string }

  // Don't have init_login_code?
  if (!init_login_code) return res.status(206).json({ message: 'Approved, but need to verify email' })

  // Incorrect code?
  if (init_login_code !== code) {
    await pushover('Invalid admin-use-init-code', JSON.stringify({ code, email }))
    return res.status(401).json({ message: 'Incorrect code' })
  }

  // Success
  setJWT({ email, name, req, res })

  return res.status(200).send({ message: 'Success! Setting jwt cookie.' })
}
