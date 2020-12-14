import { State } from './keygen-state'
import { PrivateBox } from './PrivateBox'
import { YouLabel } from './YouLabel'

export const PairwiseShares = ({ state }: { state: State }) => {
  if (state.start !== true) {
    return <></>
  }
  return (
    <>
      <h3>VI. Pairwise Shares:</h3>
      <p>Each trustee calculates private shares to send to others.</p>
      <PrivateBox>
        <p>Calculating pairwise shares...</p>
        <ol>
          <li>
            For admin@secureinternetvoting.org, f(1) = 15 + 21(1) + 9(1)<sup>2</sup> % 29 ≡ 16
          </li>
          <li>
            For trustee_1@gmail.com <YouLabel />, f(2) = 15 + 21(2) + 9(2)<sup>2</sup> % 29 ≡ 6
          </li>
          <li>
            For other_trustee@yahoo.com, f(3) = 15 + 21(3) + 9(3)<sup>2</sup> % 29 ≡ 14
          </li>
        </ol>
      </PrivateBox>
      <p>Encrypt the private shares so only the target recipient can read them.</p>
      <PrivateBox>
        <ol>
          <li>For admin@secureinternetvoting.org, pub key = 49, so E(16) = 31</li>
          <li>
            For trustee_1@gmail.com <YouLabel />, no need to encrypt to yourself.
          </li>
          <li>For other_trustee@yahoo.com, pub key = 7, so E(14) = 3</li>
        </ol>
      </PrivateBox>
      <p>Send &amp; receive pairwise shares to all the other trustees.</p>
      <PrivateBox>
        <ol>
          <li>admin@secureinternetvoting.org sent you 16</li>
          <li>Your own share is 6</li>
          <li>other_trustee@yahoo.com sent you 21</li>
        </ol>
      </PrivateBox>
    </>
  )
}
