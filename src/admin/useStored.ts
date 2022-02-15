import { useRouter } from 'next/router'
import { AdminData, Voter } from 'pages/api/election/[election_id]/admin/load-admin'
import useSWR, { mutate } from 'swr'

export function useStored(): AdminData & { valid_voters?: Voter[] } {
  const election_id = useRouter().query.election_id as string | undefined

  const { data }: { data?: AdminData } = useSWR(election_id ? url(election_id) : null, (url: string) =>
    fetch(url).then(async (r) => {
      if (!r.ok) throw await r.json()
      return await r.json()
    }),
  )

  const valid_voters = data?.voters?.filter(({ invalidated }) => !invalidated)

  return { ...data, valid_voters }
}

export function revalidate(election_id?: string) {
  mutate(url(election_id))
}

const url = (election_id?: string) => `${window.location.origin}/api/election/${election_id}/admin/load-admin`
