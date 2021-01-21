import { useEffect } from 'react'

import { api } from '../../api-helper'
import { generate_public_coefficients } from '../../crypto/threshold-keygen'
import { big } from '../../crypto/types'
import { PrivateBox } from '../PrivateBox'
import { StateAndDispatch, getParameters } from '../trustee-state'
import { YouLabel } from './YouLabel'

export const PublicCommitments = ({ dispatch, state }: StateAndDispatch) => {
  const { private_coefficients: coeffs, trustees } = state
  const { g, p } = state.parameters || {}

  // Runs once, after private coefficients have been generated
  useEffect(() => {
    if (!coeffs || state.commitments) return

    // Calculate public broadcast commitments
    const commitments = generate_public_coefficients(
      coeffs.map((c) => big(c)),
      getParameters(state),
    )

    dispatch({ commitments })

    // Tell admin your new public commitments
    api(`election/${state.election_id}/trustees/update`, {
      commitments,
      email: state.own_email,
      trustee_auth: state.trustee_auth,
    })
  }, [coeffs, trustees])

  if (!coeffs || !g || !trustees) {
    return <></>
  }

  return (
    <>
      <h3>V. Public Commitments:</h3>
      <p>
        Each trustee broadcasts public commitments A<sub>0</sub>, ..., A<sub>t-1</sub> based on their private
        coefficients, A<sub>c</sub> = g ^ a<sub>c</sub> % p.
      </p>
      <PrivateBox>
        <p>Calculating your public commitments...</p>
        <>
          {coeffs.map((coeff, index) => (
            <p key={index}>
              {state.commitments && (
                <>
                  A<sub>{index}</sub> = {g} ^ {coeff} % {p} ≡ {state.commitments[index]}
                </>
              )}
            </p>
          ))}
        </>
      </PrivateBox>
      <ol>
        {trustees.map(({ commitments, email, you }) => (
          <li key={email}>
            {commitments ? (
              <>
                {email}
                {you && <YouLabel />} broadcast commitments {commitments.join(', ')}.
              </>
            ) : (
              <i>
                Waiting on <b>{email}</b> to broadcast their commitments...
              </i>
            )}
          </li>
        ))}
      </ol>
    </>
  )
}
