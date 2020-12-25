import { big } from '../crypto/types'
import { EncryptionNote } from './EncryptionNote'
import { StateAndDispatch } from './keygen-state'

export const PartialDecryptionTest = ({ state }: StateAndDispatch) => {
  const { parameters, threshold_public_key } = state

  const plaintext = '1337'
  const randomizer = '100'

  if (!threshold_public_key || !parameters) {
    return <></>
  }

  const p = big(parameters.p)

  const encrypted = big(threshold_public_key).modPow(big(randomizer), p)
  const unlock = big(parameters.g).modPow(big(randomizer), big(parameters.p))

  return (
    <>
      <h3>XI. Partial Decryption Test:</h3>
      <p>
        To confirm the new keyshares work, we can encrypt a message for the shared threshold public key and all work
        together to unlock it.
      </p>
      <p>
        We&apos;ll encrypt the message `{plaintext}` using `{randomizer}` as the randomizer.
      </p>
      <EncryptionNote />
      <ul>
        <li>
          encrypted = {plaintext} * ({threshold_public_key} ^ {randomizer}) % {parameters.p} = {encrypted.toString()}
        </li>
        <li>
          unlock = ({parameters.g} ^ {randomizer}) % {parameters.p} = {unlock.toString()}
        </li>
      </ul>
    </>
  )
}
