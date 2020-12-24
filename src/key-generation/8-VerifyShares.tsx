import { useEffect } from 'react'

import { api } from '../api-helper'
import { is_received_share_valid } from '../crypto/threshold-keygen'
import { big } from '../crypto/types'
import { StateAndDispatch, getParameters } from './keygen-state'
import { PrivateBox } from './PrivateBox'
import { YouLabel } from './YouLabel'

export const VerifyShares = ({ dispatch, state }: StateAndDispatch) => {
  const { decrypted_shares, trustees = [], verifications = [] } = state
  const own_index = trustees.find((t) => t.you)?.index || 0

  // Re-run whenever we've decrypted a new received share
  useEffect(() => {
    if (!decrypted_shares) return

    // For each trustee...
    trustees.forEach(({ commitments, email, index }) => {
      // Don't check more than once
      if (typeof verifications[index] === 'boolean') return

      const decrypted_share = decrypted_shares[index]

      // Do we have a decrypted share from them?
      if (decrypted_share) {
        console.log(`Verifying share from ${email}...`)

        // Verify the share
        verifications[index] = is_received_share_valid(
          big(decrypted_share),
          own_index + 1,
          commitments,
          getParameters(state),
        )
      } else {
        // Otherwise this is:
        // (a) ourselves — we never encrypted, or
        // (b) a trustee that hasn't published encrypted shares yet
        // Either way, set to null bc Firebase won't store undefineds
        verifications[index] = null
      }
    })
    // Store the result
    dispatch({ verifications })

    // Tell admin verification results
    api(`election/${state.election_id}/keygen/update`, {
      email: state.your_email,
      trustee_auth: state.trustee_auth,
      verifications,
    })
  }, [decrypted_shares?.join()])

  if (!decrypted_shares || decrypted_shares.length < 2) {
    return <></>
  }

  return (
    <>
      <h3>VIII. Verify Shares:</h3>
      <p>
        Each trustee can verify their received private shares against senders&apos; public commitments A<sub>c</sub>.
      </p>
      <p>
        <i>Confirm:</i> g ^ share == Product( c from 0 to t-1 ){'{'} A<sub>c</sub> ^receivers_index ^c % p {'}'}
      </p>
      <PrivateBox>
        <p>Checking received shares...</p>
        <ol>
          {trustees.map(({ email, you }, index) => (
            <li key={index}>
              {you ? (
                'Skipping your own share.'
              ) : (
                <>
                  {email} sent you {decrypted_shares[index]}
                  {verifications[index] === undefined ? (
                    '...'
                  ) : (
                    <>
                      , which{' '}
                      {verifications[index]
                        ? '✅ passes'
                        : verifications[index] === false
                        ? ' ❌ fails'
                        : '[pending...]'}{' '}
                      commitment verification
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ol>
      </PrivateBox>
      <ol>
        {trustees.map(({ email, verifications, you }, index) => (
          <li key={email}>
            {verifications ? (
              <>
                {email}
                {you && <YouLabel />} broadcasts:
                <ol type="i">
                  {verifications.map((verified, index2) => (
                    <li key={index2}>
                      {index === index2
                        ? '⏩ skipped own'
                        : verified
                        ? '✅ passed'
                        : verified === false
                        ? ' ❌ failed'
                        : '...'}
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <i>
                Waiting on <b>{email}</b> to broadcast verication results...
              </i>
            )}
          </li>
        ))}
      </ol>
    </>
  )
}
