import Pusher from 'pusher-js'
import { useEffect } from 'react'

import { revalidate } from './useStored'

export function usePusher(election_id?: string) {
  function subscribe() {
    // Enable pusher logging - don't include this in production
    // Pusher.logToConsole = true

    const pusher = new Pusher('9718ba0612df1a49e52b', { cluster: 'us3' })

    const keygenChannel = pusher.subscribe(`keygen-${election_id}`)
    keygenChannel.bind('update', () => revalidate(election_id))

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
