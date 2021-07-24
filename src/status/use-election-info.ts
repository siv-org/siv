import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Item } from '../vote/useElectionInfo'

export function useElectionInfo() {
  const election_id = useRouter().query.election_id as string | undefined
  const [info, set_info] = useState<{
    ballot_design?: Item[]
    election_title?: string
    esignature_requested?: boolean
    has_decrypted_votes?: boolean
    last_decrypted_at?: Date
  }>({})

  // Download info once we load election_id
  useEffect(() => {
    if (!election_id) return
    ;(async () => {
      // Get info from API
      const response = await fetch(`/api/election/${election_id}/info`)
      const { ballot_design, election_title, error, esignature_requested, last_decrypted_at } = await response.json()

      if (error) return

      set_info({
        ballot_design: ballot_design ? JSON.parse(ballot_design) : undefined,
        election_title,
        esignature_requested,
        has_decrypted_votes: !!last_decrypted_at,
        last_decrypted_at: last_decrypted_at ? new Date(last_decrypted_at._seconds * 1000) : undefined,
      })
    })()
  }, [election_id])

  return info
}
