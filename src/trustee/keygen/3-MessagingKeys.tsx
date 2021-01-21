import { useEffect } from 'react'

import { api } from '../../api-helper'
import { generate_key_pair } from '../../crypto/generate-key-pair'
import { big } from '../../crypto/types'
import { PrivateBox } from '../PrivateBox'
import { StateAndDispatch } from '../trustee-state'
import { YouLabel } from '../YouLabel'

export const MessagingKeys = ({ dispatch, state }: StateAndDispatch) => {
  useEffect(() => {
    // These effects will run once we've received parameters.p and identified ourselves
    if (!state.parameters?.p || !state.own_email) return

    // Don't run more than once
    if (state.personal_key_pair) return

    // Generate your keypair
    const personal_key_pair_bigs = generate_key_pair(big(state.parameters.p))
    // Convert personal_key_pair to strings
    const personal_key_pair = {
      decryption_key: personal_key_pair_bigs.decryption_key.toString(),
      public_key: {
        recipient: personal_key_pair_bigs.public_key.recipient.toString(),
      },
    }

    dispatch({ personal_key_pair })

    // Tell admin the new public key you created
    api(`election/${state.election_id}/trustees/update`, {
      email: state.own_email,
      recipient_key: personal_key_pair.public_key.recipient,
      trustee_auth: state.trustee_auth,
    })
  }, [state.parameters?.p, state.own_email])

  if (!state.parameters || !state.trustees) {
    return <></>
  }

  const { g, p } = state.parameters
  const { decryption_key: y, public_key } = state.personal_key_pair || {
    decryption_key: undefined,
    public_key: undefined,
  }
  const h = public_key?.recipient

  return (
    <>
      <h3>III. Messaging Keys:</h3>
      <p>Everyone needs to generate a private/public key pair for peer-to-peer messaging within this key generation.</p>
      <PrivateBox>
        <p>Running Crypto.getRandomValues() on your device to generate the key pair...</p>
        <p>
          Private key <i>y</i> = {y}
        </p>
        <p>
          Public key <i>h</i> = g ^ y % p = {g} ^ {y} % {p} ≡ {h}.
        </p>
      </PrivateBox>
      <ol>
        {state.trustees.map(({ email, recipient_key, you }) => (
          <li key={email}>
            {recipient_key ? (
              <>
                {email}
                {you && <YouLabel />} broadcast their Public key is {recipient_key}
              </>
            ) : (
              <i>
                Waiting on <b>{email}</b> to broadcast their Public key...
              </i>
            )}
            .
          </li>
        ))}
      </ol>
    </>
  )
}
