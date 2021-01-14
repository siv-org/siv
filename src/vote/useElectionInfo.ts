import { Dispatch, useEffect } from 'react'

export type Item = {
  description?: string
  id?: string
  options: { name: string; sub?: string; value?: string }[]
  question?: string
  title: string
  write_in_allowed: boolean
}

export function useElectionInfo(dispatch: Dispatch<Record<string, unknown>>, election_id?: string) {
  // Download info when election_id is first loaded
  useEffect(() => {
    // Wait for election_id
    if (!election_id) return // Get info from API
    ;(async () => {
      const response = await fetch(`/api/election/${election_id}/info`)
      const { ballot_design, error, g, p, threshold_public_key } = await response.json()

      if (error) return

      dispatch({
        ballot_design: JSON.parse(ballot_design),
        public_key: { generator: g, modulo: p, recipient: threshold_public_key },
      })
    })()
  }, [election_id])
}
