import { Dispatch, useEffect } from 'react'

import { ElectionInfo } from '../../pages/api/election/[election_id]/info'
import { State } from './vote-state'

export type Item = {
  budget_available?: number
  description?: string
  id?: string
  max_score?: number
  min_score?: number
  multiple_votes_allowed?: number
  number_of_winners?: number
  options: {
    name: string
    sub?: string
    toggleable?: string
    toggleable_2?: Partial<Record<string, string>>
    value?: string
  }[]
  question?: string
  randomize_order?: boolean
  title: string
  toggleable_2_label?: string
  toggleable_label?: string
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
        custom_invitation_text,
        election_manager,
        election_title,
        esignature_requested,
        privacy_protectors_statements,
        submission_confirmation,
        threshold_public_key,
      }: ElectionInfo = await response.json()

      dispatch({
        ballot_design,
        ballot_design_finalized,
        custom_invitation_text,
        election_manager,
        election_title,
        esignature_requested,
        privacy_protectors_statements,
        public_key: threshold_public_key,
        submission_confirmation,
      })
    })()
  }, [election_id])
}
