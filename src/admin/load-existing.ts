import use_swr, { mutate } from 'swr'

import { checkPassword } from '../create/AddGroup'
import { StageAndSetter } from './AdminPage'
import { useElectionID } from './ElectionID'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

/** On page load, set the appropriate stage for existing elections. */
export const load_stage = async ({ set_stage, stage }: StageAndSetter) => {
  const { election_title } = use_stored_info()

  if (election_title && stage === 0) {
    set_stage(1)
  }
}

export function use_stored_info() {
  const election_id = useElectionID()

  const { data } = use_swr(
    checkPassword() && election_id ? `api/election/${election_id}/load-admin?password=${localStorage.password}` : null,
    fetcher,
  )

  return data || {}
}

export function revalidate() {
  const election_id = useElectionID()

  mutate(`api/election/${election_id}/load-admin?password=${localStorage.password}`)
}
