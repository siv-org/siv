import { Convention } from 'api/validate-admin-jwt'
import { useRouter } from 'next/router'
import useSWR from 'swr'

export const useConventionInfo = () => {
  const {
    query: { convention_id },
  } = useRouter()

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
