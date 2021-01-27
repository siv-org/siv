import Pusher from 'pusher-js'
import { Dispatch, useEffect } from 'react'

import { Voted } from './AddVoters'

export function initPusher({
  election_id,
  setPubKey,
  setVoted,
}: {
  election_id?: string
  setPubKey: (pub_key: string) => void
  setVoted: Dispatch<Voted>
}) {
  function subscribe() {
    // Enable pusher logging - don't include this in production
    // Pusher.logToConsole = true

    const pusher = new Pusher('9718ba0612df1a49e52b', { cluster: 'us3' })

    const channel = pusher.subscribe(`create-${election_id}`)
    channel.bind('pub_key', ({ threshold_public_key }: { threshold_public_key: string }) => {
      console.log('🆕 Pusher pub_key', threshold_public_key)
      setPubKey(threshold_public_key)
    })

    channel.bind(`votes`, (email: string) => {
      console.log('🆕 Pusher new vote submitted', email)
      setVoted({ [email]: true })
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
