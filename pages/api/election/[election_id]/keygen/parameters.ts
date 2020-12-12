import { omit } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id, trustee_auth } = req.query

  const election = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Is election_id in DB?
  const doc = await election.get()
  if (!doc.exists) {
    return res.status(400).end('Unknown Election ID.')
  }

  // Grab safe prime parameters
  const data = { ...doc.data() }
  const parameters = { g: data.g, p: data.p, q: data.q, t: data.t }

  // Grab trustees
  const trustees = (await election.collection('trustees').orderBy('index', 'asc').get()).docs.map((doc) => {
    const data = doc.data()
    if (data.auth_token === trustee_auth) {
      data.you = true
    }

    return omit({ ...data }, ['auth_token'])
  })

  res.status(200).json({ parameters, trustees })
}
