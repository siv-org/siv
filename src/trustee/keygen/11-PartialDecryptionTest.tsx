import { useEffect } from 'react'
import { RP, stringToPoint } from 'src/crypto/curve'

import { api } from '../../api-helper'
import { partial_decrypt } from '../../crypto/threshold-keygen'
import { PrivateBox } from '../PrivateBox'
import { StateAndDispatch } from '../trustee-state'
import { YouLabel } from '../YouLabel'
import { EncryptionNote } from './EncryptionNote'

export const plaintext = 'Hello World'
export const randomizer = BigInt('2417724384034137663855661539098615942228874043861702527369412269014269114')
const unlock = RP.BASE.multiply(randomizer)

export const PartialDecryptionTest = ({ dispatch, state }: StateAndDispatch) => {
  const { parameters, partial_decryption: partial, private_keyshare, threshold_public_key, trustees = [] } = state

  useEffect(() => {
    // Don't start until we have the threshold key
    if (!threshold_public_key || !parameters || !private_keyshare) return

    // Only calculate once
    if (partial) return

    const partial_decryption = partial_decrypt(unlock, BigInt(private_keyshare)).toString()

    dispatch({ partial_decryption })

    // Send partial to admin
    api(`election/${state.election_id}/trustees/update`, {
      auth: state.auth,
      email: state.own_email,
      partial_decryption,
    })
  }, [threshold_public_key])

  if (!threshold_public_key || !parameters) return <></>

  const encrypted = RP.fromHex(threshold_public_key).multiplyUnsafe(randomizer).add(stringToPoint(plaintext))

  return (
    <>
      <h3>XI. Partial Decryption Test:</h3>
      <p>
        To confirm the new keyshares work, we can encrypt a message for the shared threshold public key and all work
        together to unlock it.
      </p>
      <p>
        We&apos;ll encrypt the message `{plaintext}` using `{`${randomizer}`}` as the randomizer.
      </p>
      <EncryptionNote />
      <ul>
        <li>
          Encrypted = {plaintext} * ({threshold_public_key} * {randomizer}) ≡ {`${encrypted}`}
        </li>
        <li>
          Unlock = {`${RP.BASE}`} * {randomizer} ≡ {`${unlock}`}
        </li>
      </ul>
      <p>
        Now each party can contribute their partial decryption, using their secret keyshare:
        <br />
        <i>Partial_decryption = Unlock * keyshare</i>
      </p>
      <PrivateBox>
        <p>
          Partial = {`${unlock}`} * {private_keyshare} ≡ {partial || '[pending...]'}
        </p>
      </PrivateBox>
      <ul>
        {trustees.map(({ email, partial_decryption, you }) => (
          <li key={email}>
            {partial_decryption ? (
              <>
                {email} {you && <YouLabel />} broadcast partial: {partial_decryption}
              </>
            ) : (
              <i>
                Waiting on <b>{email}</b> to broadcast partial
              </i>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
