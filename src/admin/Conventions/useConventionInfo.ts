import { Convention } from 'api/validate-admin-jwt'
import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'

export const useConventionInfo = () => {
  const { convention_id } = useRouter().query

  const { data }: { data?: Convention } = useSWR(
    !convention_id ? null : `/api/conventions/${convention_id}/load-convention-admin`,
    (url: string) =>
      fetch(url).then(async (r) => {
        if (!r.ok) throw await r.json()
        return await r.json()
      }),
  )

  return { ...data }
}

export function revalidate(convention_id: string) {
  mutate(`/api/conventions/${convention_id}/load-convention-admin`)
}
