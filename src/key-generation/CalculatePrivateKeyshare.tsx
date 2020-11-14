import { Private } from './Private'

export const CalculatePrivateKeyshare = () => (
  <>
    <h3>VIII. Calculate Private Keyshare:</h3>
    <p>Each trustee calculates own private keyshare from incoming secrets.</p>
    <Private>
      <p>Your private keyshare is the sum of each of the incoming secrets mod q...</p>
      <p>16 + 6 + 21 % 29 ≡ 14</p>
    </Private>
  </>
)
