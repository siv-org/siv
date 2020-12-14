import Pusher from 'pusher-js'
import { useEffect } from 'react'

export function initPusher() {
  function subscribe() {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true

    const pusher = new Pusher('9718ba0612df1a49e52b', {
      cluster: 'us3',
    })

    const channel = pusher.subscribe('my-channel')
    channel.bind('my-event', function (data: unknown) {
      alert(JSON.stringify(data))
    })

    // Return cleanup code
    return () => {
      channel.unbind()
    }
  }

  // Only subscribe on init
  useEffect(() => {
    return subscribe()
  }, [])
}
