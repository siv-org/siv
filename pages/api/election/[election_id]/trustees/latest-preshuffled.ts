import { NextApiRequest, NextApiResponse } from 'next'
import { firebase } from 'pages/api/_services'
import { CipherStrings } from 'src/crypto/stringify-shuffle'

import { transform_email_keys } from './commafy'

export type TrusteesLatestPreshuffled = {
  preshuffled?: Record<string, CipherStrings[]>
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query

  const election = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Get admin (index 0) trustee
  const trusteesSnapshot = await election.collection('trustees').orderBy('index', 'asc').limit(1).get()
  if (trusteesSnapshot.empty) return res.status(200).json({})

  const adminDoc = trusteesSnapshot.docs[0]

  // Get preshuffled from separate sub-docs
  const preshuffled = {} as Record<string, CipherStrings[]>
  const preshuffledDocs = await adminDoc.ref.collection('preshuffled').get()
  preshuffledDocs.docs.forEach((doc) => (preshuffled[doc.id] = (doc.data() as { value: CipherStrings[] }).value))

  const public_data: Record<string, unknown> = Object.keys(preshuffled).length > 0 ? { preshuffled } : {}

  // Convert commas back into dots
  const decommafied = transform_email_keys(public_data as Record<string, object>, 'decommafy')

  return res.status(200).json(decommafied as TrusteesLatestPreshuffled)
}
