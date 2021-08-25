import { IsUnlockBlocked } from 'pages/api/election/[election_id]/admin/is-unlock-blocked'
import useSWR, { mutate } from 'swr'

import { useStored } from '../useStored'

export function useIsUnlockBlocked(): IsUnlockBlocked | undefined {
  const { election_id } = useStored()

  const { data }: { data?: IsUnlockBlocked } = useSWR(election_id ? url(election_id) : null, (url: string) =>
    fetch(url).then(async (r) => {
      console.log({ r })
      if (!r.ok) throw await r.json()
      return await r.text()
    }),
  )

  return data
}

export function revalidateUnlockStatus(election_id?: string) {
  mutate(url(election_id))
}

const url = (election_id?: string) => `${window.location.origin}/api/election/${election_id}/admin/is-unlock-blocked`
