import { pick } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from './_services'
import { checkJwt } from './validate-admin-jwt'

export type AdminAllElectionsResponse = { archived_count: number; elections: Election[] }

export type Election = {
  ballot_design_finalized?: boolean
  created_at: { _seconds: number }
  election_title: string
  id: string
  num_voters?: number
  num_votes?: number
  threshold_public_key?: string
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Confirm they're a valid admin
  const jwt = checkJwt(req, res)
  if (!jwt.valid) return

  // Get all elections created by this admin
  const docs = (await firebase.firestore().collection('elections').where('creator', '==', jwt.email).get()).docs

  let archived_count = 0
  // Select just the fields we need
  const elections = docs.reduce((acc: Election[], doc) => {
    const data = doc.data()

    // Filter out archived
    if (data.archived_at) {
      archived_count += 1
      return acc
    }

    return [
      {
        id: doc.id,
        ...pick(data, [
          'ballot_design_finalized',
          'created_at',
          'election_title',
          'num_voters',
          'num_votes',
          'threshold_public_key',
        ]),
      } as Election,
      ...acc,
    ]
  }, [])

  res.status(200).send({ archived_count, elections } satisfies AdminAllElectionsResponse)
}
