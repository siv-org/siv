import use_swr, { mutate } from 'swr'

import { checkPassword } from '../create/AddGroup'
import { StageAndSetter } from './AdminPage'
import { useElectionID } from './ElectionID'

/** On page load, check if we're supposed to be loading an existing election
 *  If so, set the appropriate stage.
 */
export const load_stage = async ({ set_stage, stage }: StageAndSetter) => {
  const { election_title } = use_stored_info()

  if (election_title && stage === 0) {
    set_stage(1)
  }
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

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
