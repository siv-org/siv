import { Dispatch, useEffect } from 'react'

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
      const { ballot_design, election_title, error, g, p, threshold_public_key } = await response.json()

      if (error) return

      dispatch({
        ballot_design: JSON.parse(ballot_design),
        election_title,
        public_key: { generator: g, modulo: p, recipient: threshold_public_key },
      })
    })()
  }, [election_id])
}
