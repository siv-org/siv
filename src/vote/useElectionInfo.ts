import { Dispatch, useEffect } from 'react'

import { ElectionInfo } from '../../pages/api/election/[election_id]/info'

export type Item = {
  description?: string
  id?: string
  multiple_votes_allowed?: number
  options: { name: string; sub?: string; value?: string }[]
  question?: string
  title: string
  write_in_allowed: boolean
}

export function useElectionInfo(dispatch: Dispatch<Record<string, unknown>>, election_id?: string) {
  // Download info when election_id is first loaded
  useEffect(() => {
    if (!election_id) return
    ;(async () => {
      // Get info from API
      const response = await fetch(`/api/election/${election_id}/info`)

      const {
        ballot_design,
        election_title,
        esignature_requested,
        g,
        p,
        threshold_public_key,
      }: ElectionInfo = await response.json()

      dispatch({
        ballot_design,
        election_title,
        esignature_requested,
        public_key: { generator: g, modulo: p, recipient: threshold_public_key },
      })
    })()
  }, [election_id])
}
