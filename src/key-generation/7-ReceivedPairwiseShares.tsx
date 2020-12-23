import { useEffect } from 'react'

import decrypt from '../crypto/decrypt'
import { big, bigCipher, bigPubKey } from '../crypto/types'
import { StateAndDispatch } from './keygen-state'
import { PrivateBox } from './PrivateBox'

export const ReceivedPairwiseShares = ({ dispatch, state }: StateAndDispatch) => {
  const { decrypted_shares = [], parameters, pairwise_shares: shares, trustees = [], personal_key_pair } = state

  const encrypteds = trustees.map((t) => t.encrypted_pairwise_shares)

  const own_index = trustees.find((t) => t.you)?.index || 0
  const roman = convertToRoman(own_index + 1).toLowerCase()

  // Rerun whenever broadcast encrypted_pairwise_shares have changed
  useEffect(() => {
    if (!personal_key_pair || !parameters) return

    // For each trustee...
    trustees.forEach(({ email, encrypted_pairwise_shares, index }) => {
      const encrypted_share_for_us = encrypted_pairwise_shares[own_index]

      // Have they broadcast an encrypted_pairwise share for us and we haven't decrypted it yet?
      if (encrypted_share_for_us && !decrypted_shares[index]) {
        // Then lets decrypt it
        console.log(`Unlocking cipher from ${email}...`)
        decrypted_shares[index] = decrypt(
          bigPubKey({
            generator: parameters.g,
            modulo: parameters.p,
            recipient: personal_key_pair.public_key.recipient,
          }),
          big(personal_key_pair.decryption_key),
          bigCipher(JSON.parse(encrypted_share_for_us)),
        )

        // Store the decrypted result
        dispatch({ decrypted_shares })
      }
    })
  }, [encrypteds?.join()])

  // Only show after calculated own pairwise shares
  if (!shares) {
    return <></>
  }

  return (
    <>
      <h3>VII. Received Pairwise Shares:</h3>
      <p>Decrypt the shares intended for you.</p>
      <PrivateBox>
        <ol>
          {trustees.map(({ email, encrypted_pairwise_shares, index, you }) => (
            <li key={email}>
              {you ? (
                <>Your own share is {shares ? shares[own_index] : '...'}.</>
              ) : encrypted_pairwise_shares[own_index] ? (
                <>
                  {email} sent encrypted share {roman} for you:
                  {encrypted_pairwise_shares[own_index]}.
                  <br />
                  Your private key {personal_key_pair?.decryption_key} decrypts this into:{' '}
                  {decrypted_shares[index] || '...'}
                </>
              ) : (
                <i>
                  Waiting on <b>{email}</b> to broadcast encrypted share {roman} for you...
                </i>
              )}
            </li>
          ))}
        </ol>
      </PrivateBox>
      <style jsx>{`
        li {
          margin-bottom: 15px;
        }
      `}</style>
    </>
  )
}

// adapted from https://stackoverflow.com/a/41358305
function convertToRoman(num: number) {
  const roman: Record<string, number> = {
    C: 100,
    CD: 400,
    CM: 900,
    D: 500,
    I: 1,
    IV: 4,
    IX: 9,
    L: 50,
    M: 1000,
    V: 5,
    X: 10,
    XC: 90,
    XL: 40,
  }
  let str = ''

  for (const i of Object.keys(roman)) {
    const q = Math.floor(num / roman[i])
    num -= q * roman[i]
    str += i.repeat(q)
  }

  return str
}
