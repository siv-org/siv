import { CURVE } from '@noble/ed25519'
import { sumBy } from 'lodash-es'
import { useEffect } from 'react'

import { compute_keyshare } from '../../crypto/threshold-keygen'
import { PrivateBox } from '../PrivateBox'
import { StateAndDispatch } from '../trustee-state'

export const CalculatePrivateKeyshare = ({ dispatch, state }: StateAndDispatch) => {
  const { trustees = [], decrypted_shares_from = {}, private_keyshare = '...' } = state

  const num_passed = sumBy(trustees, (t) => sumBy(Object.values(t.verified || {}), Number))
  const num_expected = trustees.length * (trustees.length - 1)

  useEffect(() => {
    // Don't start until all passed verifications
    if (!num_passed || num_passed !== num_expected) return

    const incoming_bigs = Object.values(decrypted_shares_from).map(BigInt)

    // Stop if we haven't received any bigs yet
    if (!incoming_bigs.length) return

    dispatch({ private_keyshare: compute_keyshare(incoming_bigs).toString() })
  }, [num_passed])

  if (!num_passed || num_passed !== num_expected) return <></>

  return (
    <>
      <h3>IX. Calculate Private Keyshare:</h3>
      <p>Each party can calculate own private keyshare from all the incoming shares.</p>
      <PrivateBox>
        <p>Your private keyshare is the sum of each of the incoming secrets mod l...</p>
        <ul>
          {trustees.map(({ email, you }) => (
            <li key={email}>
              {you ? `Your own share is` : `${email} sent you`} {decrypted_shares_from[email]}
            </li>
          ))}
        </ul>

        <p>
          {Object.keys(decrypted_shares_from)
            .map((email) => decrypted_shares_from[email])
            .join(' + ')}{' '}
          % {`${CURVE.l}`} ≡ {private_keyshare}
        </p>
      </PrivateBox>
    </>
  )
}
