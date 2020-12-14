import { useEffect } from 'react'

import { StateAndDispatch, Trustee } from './keygen-state'

export function getTrusteesOnInit({ dispatch, state }: StateAndDispatch) {
  // Download when election_id is first loaded
  useEffect(() => {
    getLatestFromServer({ dispatch, state })
  }, [state.election_id])
}

export async function getLatestFromServer({ dispatch, state }: StateAndDispatch) {
  // Wait for election_id
  if (!state.election_id) return

  console.log('🔄 Asking server for new info...')

  // Ask API
  try {
    const response = await fetch(`/api/election/${state.election_id}/keygen/latest?trustee_auth=${state.trustee_auth}`)
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
