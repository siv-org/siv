import { useEffect } from 'react'

import { StateAndDispatch, Trustee } from './trustee-state'

export async function getLatestFromServer({ dispatch, state }: StateAndDispatch) {
  // Wait for election_id
  if (!state.election_id) return

  console.log('🔄 Asking server for new info...')

  // Ask API
  try {
    const response = await fetch(
      `/api/election/${state.election_id}/trustees/latest?auth=${state.auth}&cache_bust=${Math.random()}`,
    )
    const data = await response.json()
    dispatch(data)

    // Find own_email & own_index and store it to local state
    data.trustees.some((trustee: Trustee) => {
      if (trustee.you) {
        dispatch({ own_email: trustee.email, own_index: trustee.index })
        return true
      }
    })
  } catch (e) {
    console.error('Error loading /api/keygen/latest:', e)
  }
}

export function getTrusteesOnInit({ dispatch, state }: StateAndDispatch) {
  // Download when election_id is first loaded
  useEffect(() => {
    getLatestFromServer({ dispatch, state })
  }, [state.election_id])
}
