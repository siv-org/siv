import { CURVE } from '@noble/ed25519'
import { useEffect } from 'react'

import { pick_private_coefficients } from '../../crypto/threshold-keygen'
import { PrivateBox } from '../PrivateBox'
import { StateAndDispatch } from '../trustee-state'

export const PrivateCoefficients = ({ dispatch, state }: StateAndDispatch) => {
  const { private_coefficients: coeffs, t, trustees } = state

  const trustees_w_recipient_keys = trustees?.filter((t) => t.recipient_key)

  useEffect(() => {
    // This effect will run once all parties have broadcast a recipient key
    if (!trustees || !t || trustees_w_recipient_keys?.length !== trustees.length) return

    // Don't run if we don't have our own local private keys (already joined from another device)
    if (!state.personal_key_pair) return

    // Don't run more than once
    if (coeffs) return

    // Generate your private polynomial
    const private_coefficients = pick_private_coefficients(t).map(String)

    dispatch({ private_coefficients })
  }, [trustees, trustees_w_recipient_keys?.length])

  if (!trustees || !t || trustees_w_recipient_keys?.length !== trustees.length) return <></>

  return (
    <>
      <h3>IV. Private Coefficients:</h3>
      <p>
        Each party picks their own private coefficients in ℤ<sub>l</sub>, f(x) = a<sub>0</sub> + a<sub>1</sub>x + ... +
        a<sub>t-1</sub>x<sup>t-1</sup> % l.
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
              % {`${CURVE.l}`}
            </p>
          )}
        </>
      </PrivateBox>
    </>
  )
}
