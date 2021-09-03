import useSWR, { mutate } from 'swr'

import { Dispatch } from '../trustee-state'

export const useKeygenAttempt = (election_id: string) => {
  const { data }: { data?: number } = useSWR(url(election_id), (url: string) =>
    fetch(url).then(async (r) => {
      if (!r.ok) throw await r.json()
      return await r.json()
    }),
  )

  return data
}

export async function revalidateKeygenAttempt(election_id: string, auth: string, dispatch: Dispatch) {
  await mutate(url(election_id))
  dispatch({ reset: { auth, election_id, own_email: '' } })
}

const url = (election_id?: string) =>
  `${window.location.origin}/api/election/${election_id}/trustees/get-attempt-number`
