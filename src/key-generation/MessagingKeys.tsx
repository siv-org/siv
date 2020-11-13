import { Private } from './Private'
import { YouLabel } from './YouLabel'

export const MessagingKeys = () => (
  <>
    <h3>Messaging Keys:</h3>
    <p>
      First, everyone needs to generate a private/public key pair for peer-to-peer messaging within this key
      generation...
    </p>
    <Private>
      <p>Running crypto.random() on your device to generate the key pair...</p>
      <p>Private key (y) = 13</p>
      <p>Public key (h) = g ^ y % p = 4 ^ 13 % 57 = 28.</p>
    </Private>
    <ol>
      <li>admin@secureinternetvoting.org broadcasts their Public key is 49</li>
      <li>
        trustee_1@gmail.com <YouLabel /> broadcasts their Public key is 28.
      </li>
      <li>cool_trustee@yahoo.com broadcasts their Public key is 7.</li>
    </ol>
  </>
)
