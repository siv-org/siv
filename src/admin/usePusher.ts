import { useEffect } from 'react'
import { pusher } from 'src/pusher-helper'

import { revalidate } from './useStored'
import { revalidateUnlockStatus } from './Voters/use-is-unlock-blocked'

export function usePusher(election_id?: string) {
  function subscribe() {
    if (!pusher) return alert('Pusher not initialized')

    const keygenChannel = pusher.subscribe(`keygen-${election_id}`)
    keygenChannel.bind('update', () => {
      revalidate(election_id)
      revalidateUnlockStatus(election_id)
    })

    const statusChannel = pusher.subscribe(`status-${election_id}`)
    statusChannel.bind('pub_key', ({ threshold_public_key }: { threshold_public_key: string }) => {
      console.log('🆕 Pusher pub_key', threshold_public_key)
      revalidate(election_id)
    })

    statusChannel.bind(`votes`, (data: string) => {
      console.log('🆕 Pusher new vote submitted', data)
      revalidate(election_id)
    })

    // Return cleanup code
    return () => {
      keygenChannel.unbind()
      statusChannel.unbind()
    }
  }

  // Subscribe when we get election_id
  useEffect(() => {
    if (election_id) {
      return subscribe()
    }
  }, [election_id])
}
