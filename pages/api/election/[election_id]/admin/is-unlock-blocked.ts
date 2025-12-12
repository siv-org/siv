import { NextApiRequest, NextApiResponse } from 'next'
import { checkJwtOwnsElection } from 'pages/api/validate-admin-jwt'

import { firebase } from '../../../_services'

export type IsUnlockBlocked = null | string

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id?: string }

  // Check required params
  if (!election_id) return res.status(401).json({ error: `Missing election_id` })

  const election = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin preloading all these docs
  const loadTrustees = election.collection('trustees').orderBy('index', 'asc').get()
  const trusteesDocs = (await loadTrustees).docs
  const loadTrusteeShuffled = trusteesDocs.map(async (doc) => doc.ref.collection('shuffled').get())
  const loadTrusteePartials = trusteesDocs.map(async (doc) => doc.ref.collection('partials').get())

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  // Grab trustees
  const trustees = trusteesDocs.map((doc) => ({ ...doc.data() }))

  // Load shuffled data from sub-collections
  const trusteeShuffledDocs = await Promise.all(loadTrusteeShuffled)
  const trusteeShuffled = trusteeShuffledDocs.map((doc) => {
    const shuffled = {} as Record<string, { shuffled: unknown[] }>
    doc.docs.forEach((doc) => {
      // Data saved is just the array, but we need { shuffled: array } structure
      const data = doc.data()
      shuffled[doc.id] = Array.isArray(data) ? { shuffled: data } : (data as { shuffled: unknown[] })
    })
    return shuffled
  })

  // This var will hold the result of our search
  let waiting_on: IsUnlockBlocked = null

  // Stop if no trustees yet
  if (!trustees.length) return res.status(200).send(waiting_on)

  // How many has admin shuffled?
  const admin_shuffled = trusteeShuffled[0]
  // Stop if admin hasn't started shuffling yet
  if (!admin_shuffled || Object.keys(admin_shuffled).length === 0) return res.status(200).send(waiting_on)

  const first_col = Object.keys(admin_shuffled)[0]

  const num_admin_shuffled = admin_shuffled[first_col].shuffled.length

  // Check if any trustee haven't shuffled as many
  trusteeShuffled.every((shuffled, index) => {
    // Skip admin
    if (index === 0) return true

    const num_shuffled = shuffled[first_col]?.shuffled?.length || 0
    if (num_shuffled < num_admin_shuffled) {
      waiting_on = trustees[index].email
    }
    return !waiting_on // Break out of loop when we find one
  })
  if (waiting_on) return res.status(206).send(waiting_on)

  // Load partials from sub-collections
  const trusteePartialDocs = await Promise.all(loadTrusteePartials)
  const trusteePartials = trusteePartialDocs.map((doc) => {
    const partials = {} as Record<string, { partials: unknown[] }>
    doc.docs.forEach((doc) => {
      partials[doc.id] = doc.data() as { partials: unknown[] }
    })
    return partials
  })

  // Check if any trustees haven't decrypted
  trusteePartials.every((partials, index) => {
    // Skip admin
    if (index === 0) return true

    const num_decrypted = partials[first_col]?.partials?.length || 0
    if (num_decrypted < num_admin_shuffled) {
      waiting_on = trustees[index].email
    }
    return !waiting_on // Break out of loop when we find one
  })

  if (waiting_on) return res.status(206).send(waiting_on)

  // Not blocked
  return res.status(200).send(waiting_on)
}
