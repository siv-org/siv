import { NextApiRequest, NextApiResponse } from 'next'
import { firebase } from 'pages/api/_services'
import { PartialWithProof } from 'src/trustee/trustee-state'

import { transform_email_keys } from './commafy'

export type TrusteesLatestPartials = {
  trustees: Array<{ email: string; index: number; partials?: Record<string, { partials: PartialWithProof[] }> }>
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query

  const election = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin loading trustees immediately, instead of after awaiting election.get()
  const loadTrustees = election.collection('trustees').orderBy('index', 'asc').get()

  // Grab trustees - only load partial decryption data
  const prepTrustees = (await loadTrustees).docs.map(async (doc) => {
    const trusteeData = { ...doc.data() }

    // Get partials from separate sub-docs
    const partialDocs = await doc.ref.collection('partials').get()
    const partials = {} as Record<string, { partials: PartialWithProof[] }>
    partialDocs.docs.forEach((doc) => (partials[doc.id] = doc.data() as { partials: PartialWithProof[] }))

    const public_data: Record<string, unknown> = {
      email: trusteeData.email,
      index: trusteeData.index,
      ...(Object.keys(partials).length > 0 && { partials }),
    }

    // Convert commas back into dots
    const decommafied = transform_email_keys(public_data as Record<string, object>, 'decommafy')

    return sortObject(decommafied)
  })
  const trustees = await Promise.all(prepTrustees)

  return res.status(200).json({ trustees } as TrusteesLatestPartials)
}

const sortObject = (obj: Record<string, unknown>) =>
  Object.keys(obj)
    .sort()
    .reduce((memo, key) => ({ ...memo, [key]: obj[key] }), {})
