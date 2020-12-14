import { Private } from './Private'
import { State } from './useKeyGenState'

export const PrivateCoefficients = ({ state }: { state: State }) => {
  const trustees_w_recipient_keys = state.trustees?.filter((t) => t.recipient_key)
  if (!state.trustees || trustees_w_recipient_keys?.length !== state.trustees.length) {
    return <></>
  }

  return (
    <>
      <h3>IV. Private Coefficients:</h3>
      <p>
        Each trustee picks their own private coefficients in ℤ<sub>q</sub>, f(x) = a<sub>0</sub> + a<sub>1</sub>x + ...
        + a<sub>t-1</sub>x<sup>t-1</sup> % q.
      </p>
      <Private>
        <p>Using Crypto.getRandomValues() on your device to generate your private polynomial...</p>
        <p>
          f(x) = 15 + 21x + 9x<sup>2</sup> % 29
        </p>
      </Private>
    </>
  )
}
