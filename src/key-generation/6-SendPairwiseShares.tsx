import { keyBy, mapValues } from 'lodash-es'
import { useEffect } from 'react'

import { api } from '../api-helper'
import encrypt from '../crypto/encrypt'
import pickRandomInteger from '../crypto/pick-random-integer'
import { evaluate_private_polynomial } from '../crypto/threshold-keygen'
import { big, bigPubKey, toStrings } from '../crypto/types'
import { StateAndDispatch, getParameters } from './keygen-state'
import { PrivateBox } from './PrivateBox'
import { YouLabel } from './YouLabel'

export const SendPairwiseShares = ({ dispatch, state }: StateAndDispatch) => {
  const {
    encrypted_pairwise_shares_for: encrypteds_for,
    pairwise_randomizers_for: randomizers,
    pairwise_shares_for: shares,
    parameters,
    private_coefficients: coeffs,
    trustees,
  } = state
  const trustees_w_commitments = trustees?.filter((t) => t.commitments).length

  // Runs once, after all commitments have been broadcast
  useEffect(() => {
    // Need these before we begin
    if (!parameters || !trustees || !coeffs || trustees_w_commitments !== trustees.length) return

    // Don't run if we've already calculated these
    if (shares) return

    const trusteesMap = keyBy(trustees, 'email')

    // Calculate pairwise shares
    const pairwise_shares_for = mapValues(trusteesMap, ({ index }) =>
      evaluate_private_polynomial(
        index + 1,
        coeffs.map((c) => big(c)),
        getParameters(state),
      ).toString(),
    )

    // Encrypt the pairwise shares for the target recipients eyes only...

    // First we pick randomizers for each
    const pairwise_randomizers_for = mapValues(trusteesMap, () => pickRandomInteger(big(parameters.p)))

    // Then we encrypt
    const encrypted_pairwise_shares_for = trustees.reduce(
      (memo, { email, recipient_key, you }) =>
        you
          ? memo // Don't encrypt to self
          : {
              ...memo,
              [email]: toStrings(
                encrypt(
                  bigPubKey({ generator: parameters.g, modulo: parameters.p, recipient: recipient_key as string }),
                  pairwise_randomizers_for[email],
                  big(pairwise_shares_for[email]),
                ),
              ),
            },
      {},
    )

    dispatch({
      encrypted_pairwise_shares_for,
      pairwise_randomizers_for: mapValues(pairwise_randomizers_for, (r) => r.toString()),
      pairwise_shares_for,
    })

    // Send encrypted_pairwise_shares to admin to broadcast
    api(`election/${state.election_id}/keygen/update`, {
      email: state.own_email,
      encrypted_pairwise_shares_for,
      trustee_auth: state.trustee_auth,
    })
  }, [coeffs, trustees_w_commitments])

  if (!trustees || !coeffs || trustees_w_commitments !== trustees.length) {
    return <></>
  }

  return (
    <>
      <h3>VI. Send Pairwise Shares:</h3>
      <p>Each trustee calculates private shares to send to others.</p>
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
              % {parameters?.q} ≡ {state.pairwise_shares_for ? state.pairwise_shares_for[email] : '[pending...]'}
            </li>
          ))}
        </ol>
      </PrivateBox>
      <p>Encrypt the private shares so only the target recipient can read them.</p>
      <p className="encryption-note">
        <code>
          <i>https://en.wikipedia.org/wiki/ElGamal_encryption</i>
          {'\n'}encrypted = message * (recipient ^ randomizer) % modulo
          {'\n'}unlock = (generator ^ randomizer) % modulo
        </code>
      </p>
      <PrivateBox>
        <ol>
          {trustees.map(({ email, recipient_key, you }, index) => (
            <li key={email}>
              For {email}
              {you ? (
                <>
                  <YouLabel />, no need to encrypt to yourself.
                </>
              ) : (
                <>
                  , pub key = {recipient_key}, <br />
                  using randomizer {randomizers ? randomizers[index] : '[pending...]'}, so E(
                  {shares ? shares[email] : '[pending...]'}) = {encrypteds_for ? encrypteds_for[index] : '[pending...]'}
                </>
              )}
            </li>
          ))}
        </ol>
      </PrivateBox>
      <p>Send &amp; receive pairwise shares to all the other trustees.</p>
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

        .encryption-note {
          margin-bottom: 20px;
          border: 1px solid #ccc;
          padding: 5px 10px;
          border-radius: 4px;
        }

        code {
          font-size: 13px;
          white-space: pre;
        }

        .encrypted-shares {
          margin-bottom: 0;
        }
      `}</style>
    </>
  )
}
