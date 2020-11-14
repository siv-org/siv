import { Private } from './Private'

export const PrivateCoefficients = () => (
  <>
    <h3>IV. Private Coefficients:</h3>
    <p>Each trustee picks their own private coefficients in ℤ[q]</p>
    <Private>
      <p>Using Crypto.getRandomValues() on your device to generate your private polynomial...</p>
      <p>0 = 15 + 21x + 9x^2</p>
    </Private>
  </>
)
