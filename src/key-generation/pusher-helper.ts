import Pusher from 'pusher-js'
import { useEffect } from 'react'

import { getTrusteesAndParameters } from './get-info-from-server'
import { StateAndDispatch } from './useKeyGenState'

export function initPusher({ dispatch, state }: StateAndDispatch) {
  function subscribe() {
    // Enable pusher logging - don't include this in production
    // Pusher.logToConsole = true

    const pusher = new Pusher('9718ba0612df1a49e52b', { cluster: 'us3' })

    const channel = pusher.subscribe('keygen')
    channel.bind('update', function (data: unknown) {
      console.log('❕ Pusher keygen:update', data)
      getTrusteesAndParameters({ dispatch, state })
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
