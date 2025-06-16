import { CURVE, RP } from 'src/crypto/curve'

import { State } from '../trustee-state'

export const Parameters = ({ state }: { state: State }) => {
  if (!state.t) return <></>

  const n = state.trustees?.length
  const { t } = state

  return (
    <>
      <h3>II. Parameters:</h3>
      <p>
        The goal is to generate a {t} of {n} threshold key (<i>t</i> = {t}, <i>n</i> = {n})
      </p>
      <p>Our prime order group is Ristretto255, derived from Curve25519.</p>
      <ul>
        <li>
          Prime Order <i>l</i> = {`${CURVE.l}`} ({CURVE.l.toString(2).length} bits)
        </li>
        <li>
          Generator <i>G</i> = {`${RP.BASE}`}
        </li>
      </ul>
      <p>Ristretto points are represented by capital letters, scalars by lowercase.</p>
      <p>
        The operation (RistrettoPoint * scalar) is{' '}
        <a href="https://en.wikipedia.org/wiki/Elliptic_curve_point_multiplication" rel="noreferrer" target="_blank">
          Point Multiplication
        </a>
        , a one-way function.
      </p>
    </>
  )
}
