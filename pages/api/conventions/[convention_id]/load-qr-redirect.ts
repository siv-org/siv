import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'

type ConventionInfo = {
  active_redirect?: string
  convention_title: string
}

export type ConventionRedirectInfo = ConventionInfo & {
  active_ballot_auth?: string
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { convention_id, qr_id } = req.query
  if (typeof convention_id !== 'string') return res.status(401).json({ error: `Missing convention_id` })

  if (typeof qr_id !== 'string') return res.status(401).json({ error: `Missing qr_id` })

  // Start loading convention and QR info
  const conventionDoc = firebase.firestore().collection('conventions').doc(convention_id)
  const loadConvention = conventionDoc.get()
  const qrDoc = await conventionDoc.collection('qr_ids').doc(qr_id).get()

  // Do they both exist?
  if (!(await loadConvention).exists) return res.status(401).json({ error: `Convention not found` })

  const convention = { ...(await loadConvention).data() }

  const conventionInfo = {
    active_redirect: convention.active_redirect,
    convention_title: convention.convention_title,
  } as ConventionInfo

  if (!qrDoc.exists) return res.status(401).json({ error: `QR ID not found`, info: conventionInfo })
  const qr = { ...qrDoc.data() }
  const active_ballot_auth = (qr.ballot_auths || {})[convention.active_redirect]

  return res.status(200).send({
    info: {
      active_ballot_auth,
      ...conventionInfo,
    } as ConventionRedirectInfo,
  })
}
