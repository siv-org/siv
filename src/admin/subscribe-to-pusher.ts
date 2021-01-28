import Pusher from 'pusher-js'
import { useEffect } from 'react'

import { revalidate } from './load-existing'

export function subscribe_to_pusher(election_id?: string) {
  function subscribe() {
    // Enable pusher logging - don't include this in production
    // Pusher.logToConsole = true

    const pusher = new Pusher('9718ba0612df1a49e52b', { cluster: 'us3' })

    const channel = pusher.subscribe(`create-${election_id}`)
    channel.bind('pub_key', ({ threshold_public_key }: { threshold_public_key: string }) => {
      console.log('🆕 Pusher pub_key', threshold_public_key)
      revalidate(election_id)
    })

    channel.bind(`votes`, (email: string) => {
      console.log('🆕 Pusher new vote submitted', email)
      revalidate(election_id)
    })

    // Return cleanup code
    return () => {
      channel.unbind()
    }
  }

  // Subscribe when we get election_id
  useEffect(() => {
    if (election_id) {
      return subscribe()
    }
  }, [election_id])
}
