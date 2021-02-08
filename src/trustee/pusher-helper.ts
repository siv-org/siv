import Pusher from 'pusher-js'
import { useEffect } from 'react'

import { getLatestFromServer } from './get-latest-from-server'
import { StateAndDispatch } from './trustee-state'

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

    channel.bind('reset-keygen', (data: unknown) => {
      console.log('🤡 Pusher reset', data)
      const { auth, election_id } = state
      const storage_key = `trustee-${election_id}-${auth}`
      localStorage.removeItem(storage_key)
      console.log(`Cleared localStorage[${`trustee-${state.election_id}-${state.auth}`}]`)
      dispatch({ reset: { auth, election_id, own_email: '' } })
    })

    channel.bind('reset-unlock', (data: unknown) => {
      console.log('🤡 Pusher reset-unlock', data)
      dispatch({ reset_unlock: true })
      getLatestFromServer({ dispatch, state })
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
