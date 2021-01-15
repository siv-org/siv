import { useEffect, useState } from 'react'

import { Item } from '../vote/useElectionInfo'

export function useBallotDesign(election_id?: string) {
  const [info, set_info] = useState<{ ballot_design?: Item[]; has_decrypted_votes?: boolean }>({})

  // Download info once we load election_id
  useEffect(() => {
    if (!election_id) return
    ;(async () => {
      // Get info from API
      const response = await fetch(`/api/election/${election_id}/info`)
      const { ballot_design, error, last_decrypted_at } = await response.json()

      if (error) return

      set_info({ ballot_design: JSON.parse(ballot_design), has_decrypted_votes: !!last_decrypted_at })
    })()
  }, [election_id])

  return info
}
