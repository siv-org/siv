import { Private } from './Private'

export const PrivateCoefficients = () => (
  <>
    <h3>IV. Private Coefficients:</h3>
    <p>
      Each trustee picks their own private coefficients in ℤ<sub>q</sub>, 0 = a<sub>0</sub> + a<sub>1</sub>x + ... + a
      <sub>t-1</sub>x<sup>t-1</sup>
    </p>
    <Private>
      <p>Using Crypto.getRandomValues() on your device to generate your private polynomial...</p>
      <p>
        0 = 15 + 21x + 9x<sup>2</sup>
      </p>
    </Private>
  </>
)
