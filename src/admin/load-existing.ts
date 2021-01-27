import { useEffect } from 'react'
import use_swr, { mutate } from 'swr'

import { LoadAdminResponse } from '../../pages/api/election/[election_id]/load-admin'
import { checkPassword } from '../create/AddGroup'
import { StageAndSetter } from './AdminPage'
import { useElectionID } from './ElectionID'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

/** On page load, set the appropriate stage for existing elections. */
export const load_stage = async ({ set_stage, stage }: StageAndSetter) => {
  const { election_title, threshold_public_key } = use_stored_info()

  useEffect(() => {
    if (threshold_public_key && stage < 2) return set_stage(2)
    if (election_title && stage < 1) return set_stage(1)
  }, [election_title, threshold_public_key])
}

export function use_stored_info(): LoadAdminResponse {
  const election_id = useElectionID()

  const { data } = use_swr(
    checkPassword() && election_id ? `api/election/${election_id}/load-admin?password=${localStorage.password}` : null,
    fetcher,
  )

  return data || {}
}

export function revalidate(election_id?: string) {
  mutate(`api/election/${election_id}/load-admin?password=${localStorage.password}`)
}
