import { useEffect } from 'react'
import { RP } from 'src/crypto/curve'

import { compute_pub_key } from '../../crypto/threshold-keygen'
import { StateAndDispatch } from '../trustee-state'

export const PublicThresholdKey = ({ dispatch, state }: StateAndDispatch) => {
  const { private_keyshare, threshold_public_key = '...', trustees = [] } = state

  useEffect(() => {
    // Don't start until after private keyshare is calculated
    if (!private_keyshare) return

    const constant_commitments = trustees.map((t) => RP.fromHex(t.commitments[0]))

    dispatch({ threshold_public_key: compute_pub_key(constant_commitments).toString() })
  }, [private_keyshare])

  if (!private_keyshare) return <></>

  return (
    <>
      <h3>X. Public Threshold Key:</h3>
      <p>
        Anyone can calculate the generated Public Key as the sum of all broadcasts A<sub>0</sub>.
      </p>
      <ul>
        {trustees.map(({ commitments, email }) => (
          <li key={email}>
            {email} had broadcast A<sub>0</sub> = {commitments[0]}
          </li>
        ))}
      </ul>
      <p>
        Public threshold key = {trustees.map(({ commitments }) => commitments[0]).join(' + ')} ≡ {threshold_public_key}
      </p>
    </>
  )
}
