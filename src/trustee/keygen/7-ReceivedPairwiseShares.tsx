import { sumBy } from 'lodash-es'
import { useEffect } from 'react'

import { keygenDecrypt } from '../../crypto/keygen-encrypt'
import { PrivateBox } from '../PrivateBox'
import { StateAndDispatch } from '../trustee-state'

export const ReceivedPairwiseShares = ({ dispatch, state }: StateAndDispatch) => {
  const { decrypted_shares_from = {}, own_email, pairwise_shares_for: shares, personal_key_pair, trustees = [] } = state

  const num_encrypteds_broadcast = sumBy(trustees, (t) => Object.keys(t.encrypted_pairwise_shares_for || {}).length)

  // Reruns whenever more encrypted_pairwise_shares_for are broadcast
  useEffect(() => {
    if (!personal_key_pair) return

    // For each trustee...
    trustees.forEach(({ email, encrypted_pairwise_shares_for = {} }) => {
      const encrypted_share_for_us = encrypted_pairwise_shares_for[own_email]

      // Have they broadcast an encrypted_pairwise_share for us and we haven't decrypted it yet?
      if (encrypted_share_for_us && !decrypted_shares_from[email]) {
        // Then lets decrypt it
        console.log(`Unlocking cipher from ${email}...`)
        ;(async () => {
          decrypted_shares_from[email] = await keygenDecrypt(
            BigInt(personal_key_pair.decryption_key),
            encrypted_share_for_us,
          )

          // Store the decrypted result
          dispatch({ decrypted_shares_from })
        })()
      }
    })
  }, [num_encrypteds_broadcast])

  // Only show after calculated own pairwise shares
  if (!shares) return <></>

  return (
    <>
      <h3>VII. Received Pairwise Shares:</h3>
      <p>Decrypt the shares intended for you.</p>
      <PrivateBox>
        <ol>
          {trustees.map(({ email, encrypted_pairwise_shares_for = {}, you }) => (
            <li key={email}>
              {you ? (
                <>Your own share is {shares ? shares[own_email] : '[pending...]'}</>
              ) : encrypted_pairwise_shares_for[own_email] ? (
                <>
                  {email} sent you this encrypted share:
                  <p className="encrypteds">{encrypted_pairwise_shares_for[own_email]}</p>
                  Your private key {personal_key_pair?.decryption_key} decrypts this into:{' '}
                  {decrypted_shares_from[email] || '[pending...]'}
                </>
              ) : (
                <i>
                  Waiting on <b>{email}</b> to broadcast encrypted share for you...
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

        .encrypteds {
          font-size: 13px;
          margin: 0 0 10px;
        }

        b {
          font-weight: 600;
        }
      `}</style>
    </>
  )
}
