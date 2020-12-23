import { State } from './keygen-state'
import { PrivateBox } from './PrivateBox'
import { YouLabel } from './YouLabel'

export const VerifyShares = ({ state }: { state: State }) => {
  if (state.start !== true) {
    return <></>
  }
  return (
    <>
      <h3>VIII. Verify Shares:</h3>
      <p>Each trustee can verify their received shares.</p>
      <PrivateBox>
        <p>Checking received shares...</p>
        <ol>
          <li>admin@secureinternetvoting.org sent you 16, which matches commitments ✅</li>
          <li>Skipping your own share.</li>
          <li>other_trustee@yahoo.com sent you 21, which matches commitments ✅</li>
        </ol>
      </PrivateBox>
      <ol>
        <li>admin@secureinternetvoting.org broadcasts 2 of 2 shares verified.</li>
        <li>
          trustee_1@gmail.com <YouLabel /> broadcasts 2 of 2 shares verified.
        </li>
        <li>other_trustee@yahoo.com broadcasts 2 of 2 shares verified.</li>
      </ol>
    </>
  )
}
