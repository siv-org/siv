import ms from 'ms'
import { useEffect } from 'react'

import { StateAndDispatch, Trustee } from './useKeyGenState'

let interval: ReturnType<typeof setInterval>
export function useLatestInfoFromServer({ dispatch, state }: StateAndDispatch) {
  async function getTrusteesAndParameters() {
    // Wait for election_id
    if (!state.election_id) return

    console.log('Asking server for new info...')

    // Ask API
    try {
      const response = await fetch(
        `/api/election/${state.election_id}/keygen/parameters?trustee_auth=${state.trustee_auth}`,
      )
      const data = await response.json()
      dispatch(data)

      // Find your own email and store it to local state
      data.trustees.some((trustee: Trustee) => {
        if (trustee.you) {
          dispatch({ your_email: trustee.email })
          return true
        }
      })
    } catch (e) {
      console.error('Error loading trustees:', e)
    }
  }

  // Download when election_id is first loaded, and then again on an interval
  useEffect(() => {
    interval = setInterval(getTrusteesAndParameters, ms('5s'))
    return () => clearInterval(interval)
  }, [state.election_id])
}
