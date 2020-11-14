import { Private } from './Private'
import { YouLabel } from './YouLabel'

export const VerifyShares = () => (
  <>
    <h3>VII. Verify Shares:</h3>
    <p>Each trustee can verify their received shares.</p>
    <Private>
      <p>Checking received shares...</p>
      <ol>
        <li>admin@secureinternetvoting.org sent you 16, which matches commitments ✅</li>
        <li>Skipping your own share.</li>
        <li>other_trustee@yahoo.com sent you 21, which matches commitments ✅</li>
      </ol>
    </Private>
    <ol>
      <li>admin@secureinternetvoting.org broadcasts 2 of 2 shares verified.</li>
      <li>
        trustee_1@gmail.com <YouLabel /> broadcasts 2 of 2 shares verified.
      </li>
      <li>other_trustee@yahoo.com broadcasts 2 of 2 shares verified.</li>
    </ol>
  </>
)
