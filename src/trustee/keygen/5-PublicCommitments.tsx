import { useEffect } from 'react'
import { RP } from 'src/crypto/curve'

import { api } from '../../api-helper'
import { generate_public_coefficients } from '../../crypto/threshold-keygen'
import { PrivateBox } from '../PrivateBox'
import { StateAndDispatch } from '../trustee-state'
import { YouLabel } from '../YouLabel'

export const PublicCommitments = ({ dispatch, state }: StateAndDispatch) => {
  const { private_coefficients: coeffs, trustees } = state

  // Runs once, after private coefficients have been generated
  useEffect(() => {
    if (!coeffs || state.commitments) return

    // Calculate public broadcast commitments
    const commitments = generate_public_coefficients(coeffs.map(BigInt)).map(String)

    dispatch({ commitments })

    // Tell admin your new public commitments
    api(`election/${state.election_id}/trustees/update`, {
      auth: state.auth,
      commitments,
      email: state.own_email,
    })
  }, [coeffs, trustees])

  if (!coeffs || !trustees) return <></>

  return (
    <>
      <h3>V. Public Commitments:</h3>
      <p>
        Each party broadcasts public commitments A<sub>0</sub>, ..., A<sub>t-1</sub> based on their private
        coefficients, A<sub>c</sub> = G * a<sub>c</sub>.
      </p>
      <PrivateBox>
        <p>Calculating your public commitments...</p>
        <>
          {coeffs.map((coeff, index) => (
            <p key={index}>
              {state.commitments && (
                <>
                  A<sub>{index}</sub> = {`${RP.BASE}`} * {coeff} ≡ {state.commitments[index]}
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
