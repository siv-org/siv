import { Private } from './Private'
import { State } from './useKeyGenState'
import { YouLabel } from './YouLabel'

export const PublicBroadcastValues = ({ state }: { state: State }) => {
  const coeffs = state.private_coefficients
  const { g, p } = state.parameters || {}

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
              A<sub>{index + 1}</sub> = {g} ^ {coeff} % {p} ≡ 49
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
