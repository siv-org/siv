import useSWR, { mutate } from 'swr'

export const useKeygenAttempt = (election_id: string) => {
  const { data }: { data?: number } = useSWR(url(election_id), (url: string) =>
    fetch(url).then(async (r) => {
      if (!r.ok) throw await r.json()
      return await r.json()
    }),
  )

  return data
}

export function revalidate(election_id?: string) {
  mutate(url(election_id))
}

const url = (election_id?: string) =>
  `${window.location.origin}/api/election/${election_id}/trustees/get-attempt-number`
