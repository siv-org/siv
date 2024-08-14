import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'
import { Item } from 'src/vote/storeElectionInfo'

export type ElectionInfo = {
  ballot_design?: Item[]
  ballot_design_finalized?: boolean
  election_homepage?: string
  election_title?: string
  esignature_requested?: boolean
  g?: string
  has_decrypted_votes?: boolean
  last_decrypted_at?: Date
  observers?: string[]
  p?: string
  privacy_protectors_statements?: string
  submission_confirmation?: string
  threshold_public_key?: string
  voter_applications_allowed?: boolean
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query

  const electionDoc = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin preloading
  const loadObservers = electionDoc.collection('trustees').orderBy('index').get()

  const data = (
    await firebase
      .firestore()
      .collection('elections')
      .doc(election_id as string)
      .get()
  ).data()

  // Is election_id in DB?
  if (!data) return res.status(400).json({ error: 'Unknown Election ID.' })

  const observers = (await loadObservers).docs.map((doc, index) => doc.data().name || `Verifying Observer ${index + 1}`)

  const {
    ballot_design,
    ballot_design_finalized,
    election_homepage,
    election_title,
    esignature_requested,
    g,
    last_decrypted_at,
    p,
    privacy_protectors_statements,
    submission_confirmation,
    threshold_public_key,
    voter_applications_allowed,
  } = data

  const info: ElectionInfo = {
    ballot_design: ballot_design ? JSON.parse(ballot_design) : undefined,
    ballot_design_finalized,
    election_homepage,
    election_title,
    esignature_requested,
    g,
    has_decrypted_votes: !!last_decrypted_at,
    last_decrypted_at: last_decrypted_at ? new Date(last_decrypted_at._seconds * 1000) : undefined,
    observers,
    p,
    privacy_protectors_statements,
    submission_confirmation,
    threshold_public_key,
    voter_applications_allowed,
  }

  // Return public election fields
  res.status(200).json(info)
}
