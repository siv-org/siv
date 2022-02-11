import { useEffect } from 'react'
import { RP } from 'src/crypto/curve'
import { mapValues } from 'src/utils'

import { api } from '../../api-helper'
import { generate_key_pair } from '../../crypto/generate-key-pair'
import { PrivateBox } from '../PrivateBox'
import { StateAndDispatch } from '../trustee-state'
import { YouLabel } from '../YouLabel'

export const MessagingKeys = ({ dispatch, state }: StateAndDispatch) => {
  const { auth, own_email, personal_key_pair, trustees } = state

  useEffect(() => {
    // These effects will run once we've identified ourselves
    if (!own_email) return

    // Don't run more than once
    if (personal_key_pair) return

    // Don't run if admin already has a different pub_key for us
    if (trustees && trustees[state.own_index].recipient_key)
      return alert('Another device has already joined this ceremony using this Observer Token. Refusing to override.')

    // Generate your keypair
    const new_key_pair = mapValues(generate_key_pair(), String)

    dispatch({ personal_key_pair: new_key_pair })

    // Tell admin the new public key you created
    api(`election/${state.election_id}/trustees/update`, {
      auth,
      email: own_email,
      recipient_key: new_key_pair.public_key,
    })
  }, [own_email])

  if (!trustees) return <></>

  const { decryption_key: y, public_key } = personal_key_pair || {
    decryption_key: undefined,
    public_key: undefined,
  }
  const H = public_key

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
          Public key <i>H</i> = G * y = {`${RP.BASE}`} * {y} ≡ {H}.
        </p>
      </PrivateBox>
      <ol>
        {trustees.map(({ email, recipient_key, you }) => (
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
