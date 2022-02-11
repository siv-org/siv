import bluebird from 'bluebird'
import { keyBy, mapValues } from 'lodash-es'
import { useEffect } from 'react'
import { CURVE, RP, random_bigint } from 'src/crypto/curve'

import { api } from '../../api-helper'
import { keygenEncrypt } from '../../crypto/keygen-encrypt'
import { evaluate_private_polynomial } from '../../crypto/threshold-keygen'
import { PrivateBox } from '../PrivateBox'
import { StateAndDispatch } from '../trustee-state'
import { YouLabel } from '../YouLabel'

export const SendPairwiseShares = ({ dispatch, state }: StateAndDispatch) => {
  const {
    auth,
    encrypted_pairwise_shares_for: encrypteds_for,
    own_email,
    pairwise_randomizers_for: randomizers,
    pairwise_shares_for: shares,
    private_coefficients: coeffs,
    trustees,
  } = state
  const trustees_w_commitments = trustees?.filter((t) => t.commitments).length

  // Runs once, after all commitments have been broadcast
  useEffect(() => {
    // Need these before we begin
    if (!trustees || !coeffs || trustees_w_commitments !== trustees.length) return

    // Don't run if we've already calculated these
    if (shares) return

    const trusteesMap = keyBy(trustees, 'email')

    // Calculate pairwise shares
    const pairwise_shares_for = mapValues(trusteesMap, ({ index }) =>
      evaluate_private_polynomial(index + 1, coeffs.map(BigInt)).toString(),
    )
    // console.log(pairwise_shares_for)

    // Save the share for yourself
    dispatch({ decrypted_shares_from: { [own_email]: pairwise_shares_for[own_email] } })

    // Encrypt the pairwise shares for the target recipients eyes only...

    // First we pick randomizers for each
    const pairwise_randomizers_for = mapValues(trusteesMap, random_bigint)

    ;(async () => {
      // Then we encrypt
      const encrypted_pairwise_shares_for = mapValues(
        (await bluebird.props(
          trustees.reduce(
            (memo, { email, recipient_key, you }) =>
              you
                ? memo // Don't encrypt to self
                : {
                    ...memo,
                    [email]: keygenEncrypt(
                      RP.fromHex(recipient_key!), // eslint-disable-line @typescript-eslint/no-non-null-assertion
                      pairwise_randomizers_for[email],
                      pairwise_shares_for[email],
                    ),
                  },
            {},
          ),
        )) as Record<string, unknown>,
        JSON.stringify,
      )

      dispatch({
        encrypted_pairwise_shares_for,
        pairwise_randomizers_for: mapValues(pairwise_randomizers_for, String),
        pairwise_shares_for,
      })

      // Send encrypted_pairwise_shares to admin to broadcast
      api(`election/${state.election_id}/trustees/update`, {
        auth,
        email: state.own_email,
        encrypted_pairwise_shares_for,
      })
    })()
  }, [coeffs, trustees_w_commitments])

  if (!trustees || !coeffs || trustees_w_commitments !== trustees.length) return <></>

  return (
    <>
      <h3>VI. Send Pairwise Shares:</h3>
      <p>Each party calculates private shares to send to others.</p>
      <PrivateBox>
        <p>Calculating pairwise shares...</p>
        <ol>
          {trustees.map(({ email, you }, trustee_index) => (
            <li key={email}>
              For {email}
              {you && <YouLabel />}
              <br />
              f({trustee_index + 1}) ={' '}
              {coeffs.map((coeff, term_index) => (
                <span key={term_index}>
                  {coeff}
                  {term_index ? `(${trustee_index + 1})` : ''}
                  {term_index > 1 && <sup>{term_index}</sup>}
                  {term_index !== coeffs.length - 1 && ' + '}
                </span>
              ))}{' '}
              % {`${CURVE.l}`} ≡ {state.pairwise_shares_for ? state.pairwise_shares_for[email] : '[pending...]'}
            </li>
          ))}
        </ol>
      </PrivateBox>
      <p>Encrypt the private shares so only the target recipient can read them.</p>
      <PrivateBox>
        <ol>
          {trustees.map(({ email, recipient_key, you }) => (
            <li key={email}>
              For {email}
              {you ? (
                <>
                  <YouLabel />, no need to encrypt to yourself.
                </>
              ) : (
                <>
                  , pub key = {recipient_key}, <br />
                  using randomizer {randomizers ? randomizers[email] : '[pending...]'}, so E(
                  {shares ? shares[email] : '[pending...]'}) = {encrypteds_for ? encrypteds_for[email] : '[pending...]'}
                </>
              )}
            </li>
          ))}
        </ol>
      </PrivateBox>
      <p>Send &amp; receive pairwise shares to all the other parties.</p>
      <ol>
        {trustees.map(({ email, encrypted_pairwise_shares_for = {}, you }) => (
          <li key={email}>
            {encrypted_pairwise_shares_for ? (
              <>
                {email}
                {you && <YouLabel />} broadcast encrypted shares for...
                <ul>
                  {Object.keys(encrypted_pairwise_shares_for).map((email) => (
                    <li className="encrypted-shares" key={email}>
                      {email}: {String(encrypted_pairwise_shares_for[email])}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <i>
                Waiting on <b>{email}</b> to broadcast their shares...
              </i>
            )}
          </li>
        ))}
      </ol>
      <style jsx>{`
        li {
          margin-bottom: 15px;
        }

        .encrypted-shares {
          margin-bottom: 0;
        }
      `}</style>
    </>
  )
}
