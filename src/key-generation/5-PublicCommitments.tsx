import { useEffect } from 'react'

import { generate_public_coefficients } from '../crypto/threshold-keygen'
import { big } from '../crypto/types'
import { StateAndDispatch, getParameters } from './keygen-state'
import { Private } from './Private'
import { YouLabel } from './YouLabel'

export const PublicCommitments = ({ dispatch, state }: StateAndDispatch) => {
  const { private_coefficients: coeffs } = state
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

  if (!coeffs || !g) {
    return <></>
  }

  return (
    <>
      <h3>V. Public Broadcast Commitments:</h3>
      <p>
        Each trustee broadcasts public commitments A<sub>1</sub>, ..., A<sub>t</sub> based on their private
        coefficients, A<sub>c</sub> = g ^ a<sub>c</sub> % p.
      </p>
      <Private>
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
      </Private>
      <ol>
        <li>admin@secureinternetvoting.org broadcasts commitments 5, 21, 10.</li>
        <li>
          trustee_1@gmail.com <YouLabel /> broadcasts commitments 49, 7, 1.
        </li>
        <li>other_trustee@yahoo.com broadcasts commitments 17, 36, 34.</li>
      </ol>
    </>
  )
}
