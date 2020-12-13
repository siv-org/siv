import { useEffect } from 'react'

import { api } from '../api-helper'
import { generate_key_pair } from '../crypto/generate-key-pair'
import { big } from '../crypto/types'
import { Private } from './Private'
import { StateAndDispatch } from './useKeyGenState'
import { YouLabel } from './YouLabel'

export const MessagingKeys = ({ dispatch, state }: StateAndDispatch) => {
  // These effects will run once we've received parameters.p
  useEffect(() => {
    if (!state.parameters?.p) return

    // Generate your keypair
    const personal_key_pair = generate_key_pair(big(state.parameters.p))
    dispatch({ personal_key_pair })

    // Tell admin the new public key you created
    api(`election/${state.election_id}/keygen/personal-pub-key`, {
      email: state.your_email,
      personal_recipient_key: personal_key_pair.public_key.recipient.toString(),
      trustee_auth: state.trustee_auth,
    })
  }, [state.parameters?.p])

  if (!state.parameters || !state.trustees) {
    return <></>
  }

  const { g, p } = state.parameters
  const { decryption_key, public_key } = state.personal_key_pair || { decryption_key: undefined, public_key: undefined }
  const y = decryption_key?.toString() || ''
  const h = public_key?.recipient.toString() || ''

  return (
    <>
      <h3>III. Messaging Keys:</h3>
      <p>Everyone needs to generate a private/public key pair for peer-to-peer messaging within this key generation.</p>
      <Private>
        <p>Running Crypto.getRandomValues() on your device to generate the key pair...</p>
        <p>
          Private key <i>y</i> = {y}
        </p>
        <p>
          Public key <i>h</i> = g ^ y % p = {g} ^ {y} % {p} ≡ {h}.
        </p>
      </Private>
      <ol>
        <li>admin@secureinternetvoting.org broadcasts their Public key is 49.</li>
        <li>
          trustee_1@gmail.com
          <YouLabel /> broadcasts their Public key is 28.
        </li>
        <li>other_trustee@yahoo.com broadcasts their Public key is 7.</li>
      </ol>
    </>
  )
}
