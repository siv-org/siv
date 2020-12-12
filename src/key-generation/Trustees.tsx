import { useEffect } from 'react'

import { StateAndDispatch } from './useKeyGenState'
import { YouLabel } from './YouLabel'

export const Trustees = ({ dispatch, state }: StateAndDispatch) => {
  async function getTrustees() {
    // Wait for election_id
    if (!state.election_id) return

    // Ask API
    try {
      const response = await fetch(
        `/api/election/${state.election_id}/keygen/trustees?trustee_auth=${state.trustee_auth}`,
      )
      const trustees = JSON.parse(await response.text())
      dispatch({ trustees })
    } catch (e) {
      console.error('Error loading trustees:', e)
    }
  }

  // Download trustees when election_id is first loaded
  useEffect(() => {
    getTrustees()
  }, [state.election_id])

  return (
    <>
      <h3>I. Trustees:</h3>
      <ol>
        {state.trustees.map(({ email, you }) => (
          <li key={email}>
            {email}
            {you && <YouLabel />}
          </li>
        ))}
      </ol>
    </>
  )
}
