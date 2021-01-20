import { useEffect } from 'react'

import { pick_private_coefficients } from '../../crypto/threshold-keygen'
import { StateAndDispatch, getParameters } from './keygen-state'
import { PrivateBox } from './PrivateBox'

export const PrivateCoefficients = ({ dispatch, state }: StateAndDispatch) => {
  const trustees_w_recipient_keys = state.trustees?.filter((t) => t.recipient_key)

  useEffect(() => {
    // This effect will run once all trustees have broadcast a recipient key
    if (!state.trustees || !state.parameters || trustees_w_recipient_keys?.length !== state.trustees.length) return

    // Don't run more than once
    if (state.private_coefficients) return

    // Generate your private polynomial
    const private_coefficients = pick_private_coefficients(state.parameters.t, getParameters(state)).map((coeff) =>
      coeff.toString(),
    )

    dispatch({ private_coefficients })
  }, [state.trustees, trustees_w_recipient_keys?.length])

  if (!state.trustees || !state.parameters || trustees_w_recipient_keys?.length !== state.trustees.length) {
    return <></>
  }

  const coeffs = state.private_coefficients

  return (
    <>
      <h3>IV. Private Coefficients:</h3>
      <p>
        Each trustee picks their own private coefficients in ℤ<sub>q</sub>, f(x) = a<sub>0</sub> + a<sub>1</sub>x + ...
        + a<sub>t-1</sub>x<sup>t-1</sup> % q.
      </p>
      <PrivateBox>
        <p>Using Crypto.getRandomValues() on your device to generate your private polynomial...</p>
        <>
          {coeffs && (
            <p>
              f(x) ={' '}
              {coeffs.map((coeff, index) => (
                <span key={index}>
                  {coeff}
                  {index ? 'x' : ''}
                  {index > 1 && <sup>{index}</sup>}
                  {index !== coeffs.length - 1 && ' + '}
                </span>
              ))}{' '}
              % {state.parameters.q}
            </p>
          )}
        </>
      </PrivateBox>
    </>
  )
}
