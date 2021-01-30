import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'

import { AdminData } from '../../pages/api/election/[election_id]/admin/load-admin'
import { checkPassword } from '../create/AddGroup'

export function useStored(): AdminData {
  const election_id = useRouter().query.election_id as string | undefined

  const { data } = useSWR(
    checkPassword() && election_id
      ? `api/election/${election_id}/admin/load-admin?password=${localStorage.password}`
      : null,
    (url: string) => fetch(url).then((r) => r.json()),
  )

  return data || {}
}

export function revalidate(election_id?: string) {
  mutate(`api/election/${election_id}/admin/load-admin?password=${localStorage.password}`)
}
