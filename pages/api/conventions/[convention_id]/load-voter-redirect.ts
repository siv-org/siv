import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'

export type PublicConventionInfo = {
  active_redirect?: string
  convention_title: string
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { convention_id, voter_id } = req.query
  if (!convention_id || typeof convention_id !== 'string')
    return res.status(401).json({ error: `Missing convention_id` })

  if (!voter_id || typeof voter_id !== 'string') return res.status(401).json({ error: `Missing voter_id` })

  // Start loading convention and voter info
  const conventionDoc = firebase.firestore().collection('conventions').doc(convention_id)
  const loadConvention = conventionDoc.get()
  const voterDoc = await conventionDoc.collection('voter_ids').doc(voter_id).get()

  // Do they both exist?
  if (!(await loadConvention).exists) return res.status(401).json({ error: `Convention not found` })
  if (!voterDoc.exists) return res.status(401).json({ error: `Voter not found` })

  const convention = { ...(await loadConvention).data() }

  res.status(200).send({
    info: {
      active_redirect: convention.active_redirect,
      convention_title: convention.convention_title,
    } as PublicConventionInfo,
  })
}
