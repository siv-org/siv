import { Private } from './Private'
import { State } from './useKeyGenState'
import { YouLabel } from './YouLabel'

export const PublicBroadcastValues = ({ state }: { state: State }) => {
  if (state.start !== true) {
    return <></>
  }
  return (
    <>
      <h3>V. Public Broadcast Values:</h3>
      <p>
        Each trustee broadcasts public commitments A<sub>0</sub>, ..., A<sub>t-1</sub> from their private coefficients,
        g ^ a % p.
      </p>
      <Private>
        <p>Calculating your public commitments...</p>
        <p>
          A<sub>0</sub> = 4 ^ 15 % 57 ≡ 49
        </p>
        <p>
          A<sub>1</sub> = 4 ^ 21 % 57 ≡ 7
        </p>
        <p>
          A<sub>2</sub> = 4 ^ 9 % 57 ≡ 1
        </p>
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
