import { NextApiRequest, NextApiResponse } from 'next'

import { allowCors } from '../_cors'
import { firebase } from '../_services'
import { ElectionInfo } from './[election_id]/info'

export default allowCors(async (req: NextApiRequest, res: NextApiResponse) => {
  const { limit, url } = req.query as { limit?: string; url?: string }

  if (!url) return res.status(400).json({ error: 'Missing url parameter.' })

  let query = firebase.firestore().collection('elections').where('election_homepage', '==', url)
  if (limit) query = query.limit(+limit)

  const matches = await query.get()
  if (matches.empty) return res.status(200).json([])

  const results = await Promise.all(
    matches.docs.map(async (electionDoc) => {
      const data = electionDoc.data()

      // Preload observers
      const loadObservers = electionDoc.ref.collection('trustees').orderBy('index').get()

      const observers = (await loadObservers).docs.map(
        (doc, index) => doc.data().name || `Privacy Protector ${index + 1}`,
      )

      const {
        ballot_design,
        ballot_design_finalized,
        custom_invitation_text,
        election_homepage,
        election_manager,
        election_title,
        esignature_requested,
        g,
        last_decrypted_at,
        p,
        paper_totals,
        paper_votes,
        privacy_protectors_statements,
        public_whos_voted_snapshot,
        skip_shuffle_proofs,
        submission_confirmation,
        threshold_public_key,
        voter_applications_allowed,
      } = data

      return {
        ballot_design: ballot_design ? JSON.parse(ballot_design) : undefined,
        ballot_design_finalized,
        custom_invitation_text,
        election_homepage,
        election_id: electionDoc.id,
        election_manager,
        election_title,
        esignature_requested,
        g,
        has_decrypted_votes: !!last_decrypted_at,
        last_decrypted_at: last_decrypted_at ? new Date(last_decrypted_at._seconds * 1000) : undefined,
        observers,
        p,
        paper_totals,
        paper_votes: paper_votes ? JSON.parse(paper_votes) : undefined,
        privacy_protectors_statements,
        public_whos_voted_snapshot,
        skip_shuffle_proofs,
        submission_confirmation,
        threshold_public_key,
        voter_applications_allowed,
      } as ElectionInfo & { election_id: string }
    }),
  )

  res.status(200).json(results)
})
