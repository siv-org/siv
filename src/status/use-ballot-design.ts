import { useEffect, useState } from 'react'

export function useBallotDesign(election_id?: string) {
  const [ballot_design, set_ballot_design] = useState()

  // Download ballot_design once we load election_id
  useEffect(() => {
    if (!election_id) return
    ;(async () => {
      // Get info from API
      const response = await fetch(`/api/election/${election_id}/info`)
      const { ballot_design, error } = await response.json()

      if (error) return

      set_ballot_design(JSON.parse(ballot_design))
    })()
  }, [election_id])

  return ballot_design
}
