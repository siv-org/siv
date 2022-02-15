import { VoterInvites } from 'api/election/[election_id]/admin/find-voter-invites'
import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'

export function useVoterInvites(): VoterInvites {
  const election_id = useRouter().query.election_id as string | undefined

  const { data }: { data?: VoterInvites } = useSWR(election_id ? url(election_id) : null, (url: string) =>
    fetch(url).then(async (r) => {
      if (!r.ok) throw await r.json()
      return await r.json()
    }),
  )

  return { ...data }
}

export function recheckDeliveries(election_id?: string) {
  mutate(url(election_id))
}

const url = (election_id?: string) => `${window.location.origin}/api/election/${election_id}/admin/find-voter-invites`
