import { useEffect } from 'react'

import { compute_pub_key } from '../../crypto/threshold-keygen'
import { big } from '../../crypto/types'
import { StateAndDispatch } from './keygen-state'

export const PublicThresholdKey = ({ dispatch, state }: StateAndDispatch) => {
  const { private_keyshare, trustees = [], parameters, threshold_public_key = '...' } = state

  useEffect(() => {
    // Don't start until after private keyshare is calculated
    if (!private_keyshare || !parameters) return

    const constant_commitments = trustees.map((t) => big(t.commitments[0]))

    dispatch({ threshold_public_key: compute_pub_key(constant_commitments, big(parameters.p)).toString() })
  }, [private_keyshare])

  if (!private_keyshare) {
    return <></>
  }

  return (
    <>
      <h3>X. Public Threshold Key:</h3>
      <p>
        Anyone can calculate the generated Public Key as the product of all broadcasts A<sub>0</sub> % p.
      </p>
      <ul>
        {trustees.map(({ commitments, email }) => (
          <li key={email}>
            {email} had broadcast A<sub>0</sub> = {commitments[0]}
          </li>
        ))}
      </ul>
      <p>
        Public threshold key = {trustees.map(({ commitments }) => commitments[0]).join(' * ')} % {parameters?.p} ≡{' '}
        {threshold_public_key}
      </p>
      {/* <br />
      <h3>All done. 🎉</h3> */}
    </>
  )
}
