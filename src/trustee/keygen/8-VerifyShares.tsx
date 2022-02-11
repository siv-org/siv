import { useEffect } from 'react'
import { RP } from 'src/crypto/curve'

import { api } from '../../api-helper'
import { is_received_share_valid } from '../../crypto/threshold-keygen'
import { PrivateBox } from '../PrivateBox'
import { StateAndDispatch } from '../trustee-state'
import { YouLabel } from '../YouLabel'

export const VerifyShares = ({ dispatch, state }: StateAndDispatch) => {
  const { decrypted_shares_from = {}, trustees = [], verified = {} } = state
  const own_index = trustees.find((t) => t.you)?.index || 0

  // Re-run whenever we've decrypted a new received share
  useEffect(() => {
    if (!decrypted_shares_from) return

    let updated = false

    // For each trustee...
    trustees.forEach(({ commitments, email, you }) => {
      // Stop if we already checked this person
      if (verified[email] !== undefined) return
      // Don't check our own
      if (you) return

      const decrypted_share = decrypted_shares_from[email]

      // Do we have a decrypted share from them to check?
      if (decrypted_share && commitments?.length) {
        updated = true

        console.log(`Verifying share from ${email}...`)

        // Verify the share
        verified[email] = is_received_share_valid(BigInt(decrypted_share), own_index + 1, commitments.map(RP.fromHex))
      }
    })

    // Stop if nothing changed
    if (!updated) return

    // Store the result
    dispatch({ verified })

    // Tell admin verification results
    api(`election/${state.election_id}/trustees/update`, {
      auth: state.auth,
      email: state.own_email,
      verified,
    })
  }, [Object.keys(decrypted_shares_from).join()])

  // Don't display this section until we decrypt at least 2 shares (admin's comes at start)
  if (Object.keys(decrypted_shares_from).length < 2) return <></>

  return (
    <>
      <h3>VIII. Verify Shares:</h3>
      <p>
        Each party can verify their received private shares against senders&apos; public commitments A<sub>c</sub>.
      </p>
      <p>
        <i>Confirm:</i> g * share == Sum( c from 0 to t-1 ){'{'} A<sub>c</sub> * receivers_index ^c {'}'}
      </p>
      <PrivateBox>
        <p>Checking received shares...</p>
        <ol>
          {trustees.map(({ email, you }, index) => (
            <li key={index}>
              {you ? (
                'Skipping your own share.'
              ) : !decrypted_shares_from[email] ? (
                `Still waiting on share from ${email}`
              ) : (
                <>
                  {email} sent you {decrypted_shares_from[email]}
                  {verified[email] === undefined ? (
                    '[checking...]'
                  ) : (
                    <>, which {verified[email] ? '✓ fits' : ' ❌ fails against'} commitments.</>
                  )}
                </>
              )}
            </li>
          ))}
        </ol>
      </PrivateBox>
      <ol>
        {trustees.map(({ email, verified, you }) => (
          <li key={email}>
            {verified ? (
              <>
                {email}
                {you && <YouLabel />} checked:
                <ul>
                  {trustees.map(
                    ({ email: email2 }) =>
                      email !== email2 && (
                        <li key={email2}>
                          {verified[email2]
                            ? `✅ ${email2} passed`
                            : verified[email2] === false
                            ? ` ❌ ${email2} failed`
                            : `⚠️ ${email2} [pending...]`}
                        </li>
                      ),
                  )}
                </ul>
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
