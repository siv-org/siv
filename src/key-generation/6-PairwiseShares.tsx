import { useEffect } from 'react'

import { evaluate_private_polynomial } from '../crypto/threshold-keygen'
import { big } from '../crypto/types'
import { StateAndDispatch, getParameters } from './keygen-state'
import { PrivateBox } from './PrivateBox'
import { YouLabel } from './YouLabel'

export const PairwiseShares = ({ dispatch, state }: StateAndDispatch) => {
  const { parameters, private_coefficients: coeffs, trustees } = state
  const trustees_w_commitments = trustees?.filter((t) => t.commitments).length

  // Runs once, after all commitments have been broadcast
  useEffect(() => {
    if (!trustees || !coeffs || trustees_w_commitments !== trustees.length) return

    // Calculate pairwise shares
    const pairwise_shares = trustees?.map((t, index) =>
      evaluate_private_polynomial(
        index,
        coeffs.map((c) => big(c)),
        getParameters(state),
      ).toString(),
    )

    dispatch({ pairwise_shares })
  }, [coeffs, trustees])

  if (!trustees || !coeffs || trustees_w_commitments !== trustees.length) {
    return <></>
  }
  return (
    <>
      <h3>VI. Pairwise Shares:</h3>
      <p>Each trustee calculates private shares to send to others.</p>
      <PrivateBox>
        <p>Calculating pairwise shares...</p>
        <ol>
          {trustees.map(({ email, you }, trustee_index) => (
            <li key={email}>
              For {email}
              {you && <YouLabel />}
              <br />
              f({trustee_index + 1}) ={' '}
              {coeffs.map((coeff, term_index) => (
                <span key={term_index}>
                  {coeff}
                  {term_index ? `(${trustee_index + 1})` : ''}
                  {term_index > 1 && <sup>{term_index}</sup>}
                  {term_index !== coeffs.length - 1 && ' + '}
                </span>
              ))}{' '}
              % {parameters?.q} ≡ {state.pairwise_shares ? state.pairwise_shares[trustee_index] : '...'}
              <br />
              <br />
            </li>
          ))}
        </ol>
      </PrivateBox>
      <p>Encrypt the private shares so only the target recipient can read them.</p>
      <PrivateBox>
        <ol>
          <li>For admin@secureinternetvoting.org, pub key = 49, so E(16) = 31</li>
          <li>
            For trustee_1@gmail.com <YouLabel />, no need to encrypt to yourself.
          </li>
          <li>For other_trustee@yahoo.com, pub key = 7, so E(14) = 3</li>
        </ol>
      </PrivateBox>
      <p>Send &amp; receive pairwise shares to all the other trustees.</p>
      <PrivateBox>
        <ol>
          <li>admin@secureinternetvoting.org sent you 16</li>
          <li>Your own share is 6</li>
          <li>other_trustee@yahoo.com sent you 21</li>
        </ol>
      </PrivateBox>
    </>
  )
}
