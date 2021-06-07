import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'

import { AdminData } from '../../pages/api/election/[election_id]/admin/load-admin'

// import { checkPassword } from './checkPassword'

export function useStored(): AdminData {
  const election_id = useRouter().query.election_id as string | undefined

  const { data, error } = useSWR(election_id ? url(election_id) : null, (url: string) =>
    fetch(url).then(async (r) => {
      if (!r.ok) throw await r.json()
      return await r.json()
    }),
  )

  if (error?.error?.startsWith('Invalid Password')) {
    localStorage.password = null
  }

  return data || {}
}

export function revalidate(election_id?: string) {
  mutate(url(election_id))
}

const url = (election_id?: string) =>
  `${window.location.origin}/api/election/${election_id}/admin/load-admin?password=${localStorage.password}`
