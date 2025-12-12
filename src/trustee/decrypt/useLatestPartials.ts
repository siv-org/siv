import { TrusteesLatestPartials } from 'pages/api/election/[election_id]/trustees/latest-partials'
import { useEffect } from 'react'
import { pusher } from 'src/pusher-helper'
import useSWR from 'swr'

import { PartialWithProof } from '../trustee-state'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useLatestPartials(election_id?: string) {
  const { data, mutate } = useSWR<TrusteesLatestPartials>(
    election_id ? `/api/election/${election_id}/trustees/latest-partials` : null,
    fetcher,
    { revalidateOnFocus: false },
  )

  // Listen for partial decryption updates via pusher
  useEffect(() => {
    if (!election_id || !mutate) return

    const channel = pusher?.subscribe(`keygen-${election_id}`)
    if (!channel) return

    const handleUpdate = (data: Record<string, Record<string, unknown> | string[]>) => {
      // Check if any trustee updated their partials data
      const hasPartialsUpdate = Object.values(data).some((fields) => {
        if (Array.isArray(fields)) return fields.includes('partials')
        return 'partials' in fields
      })
      if (hasPartialsUpdate) {
        console.log('🔄 Pusher partials update detected, revalidating...')
        mutate()
      }
    }

    channel.bind('update', handleUpdate)

    return () => {
      channel.unbind('update', handleUpdate)
    }
  }, [election_id, mutate])

  const partialsByEmail =
    data?.trustees?.reduce<Record<string, Record<string, PartialWithProof[]> | undefined>>((memo, trustee) => {
      if (!trustee.partials) return memo

      // Transform from Record<string, { partials: PartialWithProof[] }> to Record<string, PartialWithProof[]>
      // by unwrapping the { partials: [...] } structure
      const unwrappedPartials: Record<string, PartialWithProof[]> = {}
      Object.entries(trustee.partials).forEach(([column, wrapped]) => {
        if (wrapped && typeof wrapped === 'object' && 'partials' in wrapped) {
          unwrappedPartials[column] = (wrapped as { partials: PartialWithProof[] }).partials
        }
      })
      return { ...memo, [trustee.email]: unwrappedPartials }
    }, {}) || {}

  return { partialsByEmail }
}
