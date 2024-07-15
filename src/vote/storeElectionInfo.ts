import { Dispatch, useEffect } from 'react'

import { ElectionInfo } from '../../pages/api/election/[election_id]/info'
import { State } from './vote-state'

export type Item = {
  description?: string
  id?: string
  max_score?: number
  min_score?: number
  multiple_votes_allowed?: number
  options: { name: string; sub?: string; value?: string }[]
  question?: string
  randomize_order?: boolean
  title: string
  type?: string
  write_in_allowed: boolean
}

export function storeElectionInfo(dispatch: Dispatch<Partial<State>>, election_id?: string) {
  // Download info when election_id is first loaded
  useEffect(() => {
    if (!election_id) return
    ;(async () => {
      // Get info from API
      const response = await fetch(`/api/election/${election_id}/info`)

      const {
        ballot_design,
        ballot_design_finalized,
        election_title,
        esignature_requested,
        threshold_public_key,
      }: ElectionInfo = await response.json()

      dispatch({
        ballot_design,
        ballot_design_finalized,
        election_title,
        esignature_requested,
        public_key: threshold_public_key,
      })
    })()
  }, [election_id])
}
