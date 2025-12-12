import { pick } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'
import { firebase } from 'pages/api/_services'
import { PartialWithProof, Trustee } from 'src/trustee/trustee-state'

import { transform_email_keys } from './commafy'

export type TrusteesLatest = { t: number; trustees: Trustee[] }
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { auth, election_id } = req.query

  const election = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin loading trustees immediately, instead of after awaiting election.get()
  const loadTrustees = election.collection('trustees').orderBy('index', 'asc').get()

  // Is election_id in DB?
  const doc = await election.get()
  if (!doc.exists) return res.status(400).send('Unknown Election ID.')

  // Grab election threshold param
  const t = { ...doc.data() }.t

  // Grab trustees
  const prepTrustees = (await loadTrustees).docs.map(async (doc) => {
    const data = { ...doc.data() }
    // Add you: true if requester's own document
    if (data.auth_token === auth) data.you = true

    // Fields to keep
    const public_fields = [
      'commitments',
      'email',
      'encrypted_pairwise_shares_for',
      'index',
      'name',
      'partial_decryption',
      // 'preshuffled',
      'recipient_key',
      'shuffled',
      'verified',
      'you',
    ]

    const public_data = pick(data, public_fields)

    // Get preshuffled from separate sub-doc
    const preshuffled = await doc.ref.collection('post-election-data').doc('preshuffled').get()
    if (preshuffled.exists) public_data.preshuffled = { ...preshuffled.data() }.preshuffled

    // Get partials from separate sub-doc
    const partialDocs = await doc.ref.collection('partials').get()
    // Stitch partials back together from separate docs per column
    public_data.partials = {} as Record<string, PartialWithProof[]>
    partialDocs.docs.forEach((doc) => (public_data.partials[doc.id] = doc.data() as PartialWithProof[]))

    // Convert commas back into dots
    const decommafied = transform_email_keys(public_data, 'decommafy')

    return sortObject(decommafied) as Trustee
  })
  const trustees = await Promise.all(prepTrustees)

  const response: TrusteesLatest = { t, trustees }

  res.status(200).json(response)
}

const sortObject = (obj: Record<string, unknown>) =>
  Object.keys(obj)
    .sort()
    .reduce((memo, key) => ({ ...memo, [key]: obj[key] }), {})
