import { validate as validateEmail } from 'email-validator'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from './_services'

/** Upsert partial signup progress (email check → profile → before final application). */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, first_name, last_name, step, your_organization } = req.body as {
    email?: string
    first_name?: string
    last_name?: string
    step?: string
    your_organization?: string
  }

  if (!email || !validateEmail(email)) return res.status(400).json({ error: 'Invalid email' })

  const key = email.toLowerCase()
  const docRef = firebase.firestore().collection('applied-admins-drafts').doc(key)

  await docRef.set(
    {
      email: key,
      updated_at: new Date(),
      ...(typeof first_name === 'string' && { first_name: first_name.trim() }),
      ...(typeof last_name === 'string' && { last_name: last_name.trim() }),
      ...(typeof your_organization === 'string' && { your_organization: your_organization.trim() }),
      ...(typeof step === 'string' && step && { step }),
    },
    { merge: true },
  )

  res.status(200).json({ ok: true })
}
