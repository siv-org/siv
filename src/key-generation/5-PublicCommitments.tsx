import { useEffect } from 'react'

import { generate_public_coefficients } from '../crypto/threshold-keygen'
import { big } from '../crypto/types'
import { StateAndDispatch, getParameters } from './keygen-state'
import { PrivateBox } from './PrivateBox'
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
  }, [coeffs])

  if (!coeffs || !g || !trustees) {
    return <></>
  }

  return (
    <>
      <h3>V. Public Broadcast Commitments:</h3>
      <p>
        Each trustee broadcasts public commitments A<sub>1</sub>, ..., A<sub>t</sub> based on their private
        coefficients, A<sub>c</sub> = g ^ a<sub>c</sub> % p.
      </p>
      <PrivateBox>
        <p>Calculating your public commitments...</p>
        <>
          {coeffs.map((coeff, index) => (
            <p key={index}>
              {state.commitments && (
                <>
                  A<sub>{index + 1}</sub> = {g} ^ {coeff} % {p} ≡ {state.commitments[index]}
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
                {you && <YouLabel />} broadcasts commitments {commitments.join(', ')}.
              </>
            ) : (
              <i>
                Waiting on <b>{email}</b> to broadcast their commitments...
              </i>
            )}
            .
          </li>
        ))}
      </ol>
    </>
  )
}
