import { TrusteesLatestShuffles } from 'pages/api/election/[election_id]/trustees/latest-shuffles'
import { useEffect } from 'react'
import { getPusher } from 'src/pusher-helper'
import useSWR from 'swr'

import { Shuffled } from '../trustee-state'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useLatestShuffles(election_id?: string) {
  const { data, mutate } = useSWR<TrusteesLatestShuffles>(
    election_id ? `/api/election/${election_id}/trustees/latest-shuffles` : null,
    fetcher,
    { revalidateOnFocus: false },
  )

  // Listen for shuffle updates via pusher
  useEffect(() => {
    if (!election_id || !mutate) return

    const pusher = getPusher()
    if (!pusher) return
    const channel = pusher.subscribe(`keygen-${election_id}`)

    const handleUpdate = (data: Record<string, Record<string, unknown> | string[]>) => {
      // Check if any trustee updated their shuffled data
      const hasShuffleUpdate = Object.values(data).some((fields) => {
        if (Array.isArray(fields)) return fields.includes('shuffled')
        return 'shuffled' in fields
      })
      if (hasShuffleUpdate) {
        console.log('🔄 Pusher shuffle update detected, revalidating...')
        mutate()
      }
    }

    channel.bind('update', handleUpdate)

    return () => {
      channel.unbind('update', handleUpdate)
    }
  }, [election_id, mutate])

  const shufflesByEmail =
    data?.trustees?.reduce<Record<string, Shuffled | undefined>>(
      (memo, trustee) => ({ ...memo, [trustee.email]: trustee.shuffled }),
      {},
    ) || {}

  return { shufflesByEmail }
}
