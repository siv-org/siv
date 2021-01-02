import Pusher from 'pusher-js'
import { useEffect } from 'react'

export function initPusher({
  election_id,
  setPubKey,
  setVoted,
}: {
  election_id?: string
  setPubKey: (pub_key: string) => void
  setVoted: (voted: boolean[]) => void
}) {
  function subscribe() {
    // Enable pusher logging - don't include this in production
    // Pusher.logToConsole = true

    const pusher = new Pusher('9718ba0612df1a49e52b', { cluster: 'us3' })

    const channel = pusher.subscribe(`create-${election_id}`)
    channel.bind('pub_key', (data: string) => {
      console.log('🆕 Pusher pub_key', data)
      setPubKey(data)
    })

    channel.bind(`votes`, (data: boolean[]) => {
      console.log('🆕 Pusher new votes', data)
      setVoted(data)
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
