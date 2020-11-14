import { Private } from './Private'
import { YouLabel } from './YouLabel'

export const MessagingKeys = () => (
  <>
    <h3>III. Messaging Keys:</h3>
    <p>Everyone needs to generate a private/public key pair for peer-to-peer messaging within this key generation.</p>
    <Private>
      <p>Running Crypto.getRandomValues() on your device to generate the key pair...</p>
      <p>Private key (y) = 13</p>
      <p>Public key (h) = g ^ y % p = 4 ^ 13 % 57 = 28.</p>
    </Private>
    <ol>
      <li>admin@secureinternetvoting.org broadcasts their Public key is 49.</li>
      <li>
        trustee_1@gmail.com <YouLabel /> broadcasts their Public key is 28.
      </li>
      <li>other_trustee@yahoo.com broadcasts their Public key is 7.</li>
    </ol>
  </>
)
