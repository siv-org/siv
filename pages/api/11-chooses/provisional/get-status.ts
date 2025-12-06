import { firebase, pushover } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'
import { election_ids_for_11chooses } from 'src/vote/auth/11choosesAuth/CustomAuthFlow'

type ProvisionalStage = 'vote_submitted' | 'email_submitted' | 'voter_reg_submitted'

type ProvisionalStatus =
  | { status: 'not_found' }
  | {
      status: 'ok'
      stage: ProvisionalStage
    }

export default async function (req: NextApiRequest, res: NextApiResponse<ProvisionalStatus>) {
  const { election_id, link_auth } = req.body

  if (typeof election_id !== 'string') return res.status(400).json({ status: 'not_found' })
  if (!election_ids_for_11chooses.includes(election_id)) return res.status(400).json({ status: 'not_found' })
  if (!link_auth || typeof link_auth !== 'string') return res.status(400).json({ status: 'not_found' })

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)

  try {
    const [voterDoc] = (await electionDoc.collection('votes-pending').where('link_auth', '==', link_auth).get()).docs

    if (!voterDoc?.exists) {
      await pushover('11c/get-status: link_auth not found', JSON.stringify({ election_id, link_auth }))
      return res.status(200).json({ status: 'not_found' })
    }

    const data = voterDoc.data() || {}
    const hasEmail = Array.isArray(data.email_submitted) && data.email_submitted.length > 0
    const hasVoterRegInfo = Array.isArray(data.voterRegInfo) && data.voterRegInfo.length > 0

    let stage: ProvisionalStage = 'vote_submitted'
    if (hasEmail) stage = 'email_submitted'
    if (hasVoterRegInfo) stage = 'voter_reg_submitted'

    return res.status(200).json({ status: 'ok', stage })
  } catch (error) {
    await pushover('11c/get-status: exception', JSON.stringify({ election_id, link_auth, error }))
    return res.status(200).json({ status: 'not_found' })
  }
}


