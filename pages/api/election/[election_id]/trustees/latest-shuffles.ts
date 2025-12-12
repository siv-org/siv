import { NextApiRequest, NextApiResponse } from 'next'
import { firebase } from 'pages/api/_services'
import { Shuffled } from 'src/trustee/trustee-state'

import { transform_email_keys } from './commafy'

export type TrusteesLatestShuffles = { trustees: Array<{ email: string; index: number; shuffled?: Shuffled }> }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query

  const election = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin loading trustees immediately, instead of after awaiting election.get()
  const loadTrustees = election.collection('trustees').orderBy('index', 'asc').get()

  // Grab trustees - only load shuffle data
  const prepTrustees = (await loadTrustees).docs.map(async (doc) => {
    const trusteeData = { ...doc.data() }

    // Get shuffled from separate sub-docs
    const shuffled = {} as Shuffled
    const shuffledDocs = await doc.ref.collection('shuffled').get()
    shuffledDocs.docs.forEach((doc) => (shuffled[doc.id] = doc.data() as Shuffled[string]))

    const public_data: Record<string, unknown> = {
      email: trusteeData.email,
      index: trusteeData.index,
      ...(Object.keys(shuffled).length > 0 && { shuffled }),
    }

    // Convert commas back into dots
    const decommafied = transform_email_keys(public_data as Record<string, object>, 'decommafy')

    return sortObject(decommafied) as TrusteesLatestShuffles['trustees'][0]
  })
  const trustees = await Promise.all(prepTrustees)

  return res.status(200).json({ trustees } as TrusteesLatestShuffles)
}

const sortObject = (obj: Record<string, unknown>) =>
  Object.keys(obj)
    .sort()
    .reduce((memo, key) => ({ ...memo, [key]: obj[key] }), {})
