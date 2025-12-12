import { TrusteesLatestPreshuffled } from 'pages/api/election/[election_id]/trustees/latest-preshuffled'
import { useEffect } from 'react'
import { pusher } from 'src/pusher-helper'
import useSWR from 'swr'

import { CipherStrings } from '../../crypto/stringify-shuffle'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useLatestPreshuffled(election_id?: string) {
  const { data, mutate } = useSWR<TrusteesLatestPreshuffled>(
    election_id ? `/api/election/${election_id}/trustees/latest-preshuffled` : null,
    fetcher,
    { revalidateOnFocus: false },
  )

  // Listen for preshuffled updates via pusher (when admin unlocks)
  useEffect(() => {
    if (!election_id || !mutate) return

    const channel = pusher?.subscribe(`keygen-${election_id}`)
    if (!channel) return

    const handleUpdate = (updateData: Record<string, string[]>) => {
      // Check if admin updated shuffled data (which means preshuffled was also created)
      const hasAdminShuffleUpdate = Object.entries(updateData).some(
        ([email, fields]) => email.includes('admin') && fields.includes('shuffled'),
      )
      if (hasAdminShuffleUpdate) {
        console.log('🔄 Pusher preshuffled update detected, revalidating...')
        mutate()
      }
    }

    channel.bind('update', handleUpdate)

    return () => {
      channel.unbind('update', handleUpdate)
    }
  }, [election_id, mutate])

  return { preshuffled: (data?.preshuffled ?? {}) as Record<string, CipherStrings[]> }
}
