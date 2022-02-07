import { sumBy } from 'lodash-es'
import { useEffect } from 'react'
import { deep_strs_to_RPs, pointToString } from 'src/crypto/curve'
import { Cipher } from 'src/crypto/shuffle'

import decrypt from '../../crypto/decrypt'
import { PrivateBox } from '../PrivateBox'
import { StateAndDispatch } from '../trustee-state'

export const ReceivedPairwiseShares = ({ dispatch, state }: StateAndDispatch) => {
  const {
    decrypted_shares_from = {},
    parameters,
    pairwise_shares_for: shares,
    trustees = [],
    personal_key_pair,
    own_email,
  } = state

  const num_encrypteds_broadcast = sumBy(trustees, (t) => Object.keys(t.encrypted_pairwise_shares_for || {}).length)

  // Reruns whenever more encrypted_pairwise_shares_for are broadcast
  useEffect(() => {
    if (!personal_key_pair || !parameters) return

    // For each trustee...
    trustees.forEach(({ email, encrypted_pairwise_shares_for = {} }) => {
      const encrypted_share_for_us = encrypted_pairwise_shares_for[own_email]

      // Have they broadcast an encrypted_pairwise_share for us and we haven't decrypted it yet?
      if (encrypted_share_for_us && !decrypted_shares_from[email]) {
        // Then lets decrypt it
        console.log(`Unlocking cipher from ${email}...`)
        decrypted_shares_from[email] = pointToString(
          decrypt(
            BigInt(personal_key_pair.decryption_key),
            deep_strs_to_RPs(JSON.parse(encrypted_share_for_us)) as Cipher,
          ),
        )

        // Store the decrypted result
        dispatch({ decrypted_shares_from })
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
