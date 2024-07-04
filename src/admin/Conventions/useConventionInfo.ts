import { Convention } from 'api/validate-admin-jwt'
import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'

import { fetcher } from '../AllYourElections'

export const useConventionInfo = () => {
  const { convention_id } = useRouter().query

  const { data }: { data?: Convention } = useSWR(
    !convention_id ? null : `/api/conventions/${convention_id}/load-convention-admin`,
    fetcher,
  )

  return { ...data }
}

export function revalidate(convention_id: string) {
  mutate(`/api/conventions/${convention_id}/load-convention-admin`)
}
