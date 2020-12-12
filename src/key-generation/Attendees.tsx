import { useEffect } from 'react'

import { StateAndDispatch } from './useKeyGenState'
import { YouLabel } from './YouLabel'

export const Attendees = ({ dispatch, state }: StateAndDispatch) => {
  async function getTrustees() {
    // Wait for election_id
    if (!state.election_id) return

    // Ask API
    try {
      const response = await fetch(
        `/api/election/${state.election_id}/keygen/attendees?trustee_auth=${state.trustee_auth}`,
      )
      const trustees = JSON.parse(await response.text())
      dispatch({ trustees })
    } catch (e) {
      console.error(e)
    }
  }

  // Download trustees when election_id is first loaded
  useEffect(() => {
    getTrustees()
  }, [state.election_id])

  const awaiting = []

  return (
    <>
      <h3>I. Attendees:</h3>
      <ol>
        {state.trustees.map(({ email, you }) => (
          <li key={email}>
            {email}
            {you && <YouLabel />}
          </li>
        ))}
      </ol>

      {!awaiting.length && <p>Everyone&apos;s arrived. 👍</p>}
    </>
  )
}
