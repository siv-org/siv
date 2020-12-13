import { useEffect } from 'react'

import { StateAndDispatch, Trustee } from './useKeyGenState'
import { YouLabel } from './YouLabel'

export const Trustees = ({ dispatch, state }: StateAndDispatch) => {
  async function getTrusteesAndParameters() {
    // Wait for election_id
    if (!state.election_id) return

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

  // Download when election_id is first loaded
  useEffect(() => {
    getTrusteesAndParameters()
  }, [state.election_id])

  return (
    <>
      <h3>I. Trustees:</h3>
      <ol>
        {state.trustees?.map(({ email, you }) => (
          <li key={email}>
            {email}
            {you && <YouLabel />}
          </li>
        ))}
      </ol>
    </>
  )
}
