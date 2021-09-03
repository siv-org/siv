import { useEffect } from 'react'
import { pusher } from 'src/pusher-helper'

import { getLatestFromServer } from './get-latest-from-server'
import { revalidateKeygenAttempt } from './keygen/useKeygenAttempt'
import { StateAndDispatch } from './trustee-state'

export function initPusher({ dispatch, state }: StateAndDispatch) {
  function subscribe() {
    if (!pusher) return alert('Pusher not initialized')

    const channel = pusher.subscribe(`keygen-${state.election_id}`)
    channel.bind('update', (data: unknown) => {
      console.log('🆕 Pusher keygen:update', data)
      getLatestFromServer({ dispatch, state })
    })

    channel.bind('reset-keygen', () => {
      const { auth, election_id } = state
      revalidateKeygenAttempt(election_id, auth, dispatch)
      console.log(`♻️ New keygen attempt: observer-${election_id}-${auth}`)
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
  }, [state.election_id])
}
