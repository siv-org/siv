import Pusher from 'pusher-js'
import { useEffect } from 'react'

import { getLatestFromServer } from './get-latest-from-server'
import { StateAndDispatch } from './keygen-state'

export function initPusher({ dispatch, state }: StateAndDispatch) {
  function subscribe() {
    // Enable pusher logging - don't include this in production
    // Pusher.logToConsole = true

    const pusher = new Pusher('9718ba0612df1a49e52b', { cluster: 'us3' })

    const channel = pusher.subscribe('keygen')
    channel.bind('update', (data: unknown) => {
      console.log('🆕 Pusher keygen:update', data)
      getLatestFromServer({ dispatch, state })
    })

    channel.bind('reset', (data: unknown) => {
      console.log('🤡 Pusher reset', data)
      const { election_id, trustee_auth } = state
      const storage_key = `keygen-${election_id}-${trustee_auth}`
      localStorage.removeItem(storage_key)
      console.log(`Cleared localStorage[${`keygen-${state.election_id}-${state.trustee_auth}`}]`)
      dispatch({ reset: { election_id, own_email: '', trustee_auth } })
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
