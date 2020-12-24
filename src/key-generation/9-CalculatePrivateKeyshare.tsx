import { sumBy } from 'lodash-es'

import { State } from './keygen-state'
import { PrivateBox } from './PrivateBox'

export const CalculatePrivateKeyshare = ({ state }: { state: State }) => {
  const { trustees = [], decrypted_shares_from = {}, parameters, private_keyshare = '...' } = state

  const num_passed = sumBy(trustees, (t) => sumBy(Object.values(t.verified || {}), Number))
  const num_expected = trustees.length * trustees.length - 1

  if (!num_passed && num_passed !== num_expected) {
    return <></>
  }
  return (
    <>
      <h3>IX. Calculate Private Keyshare:</h3>
      <p>Each trustee can calculate own private keyshare from all the incoming shares.</p>
      <PrivateBox>
        <p>Your private keyshare is the sum of each of the incoming secrets mod q...</p>
        <ul>
          {Object.keys(decrypted_shares_from).map((email) => (
            <li key={email}>
              {email} sent you {decrypted_shares_from[email]}
            </li>
          ))}
        </ul>

        <p>
          {Object.keys(decrypted_shares_from)
            .map((email) => decrypted_shares_from[email])
            .join(' + ')}{' '}
          % {parameters?.q} ≡ {private_keyshare}
        </p>
      </PrivateBox>
    </>
  )
}
