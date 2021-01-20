/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Fragment, useEffect } from 'react'

import { api } from '../../api-helper'
import { partial_decrypt } from '../../crypto/threshold-keygen'
import { big } from '../../crypto/types'
import { mapValues } from '../../utils'
import { Shuffled, StateAndDispatch, getParameters } from '../keygen/keygen-state'
import { YouLabel } from '../keygen/YouLabel'

export const VotesToDecrypt = ({ state }: StateAndDispatch) => {
  const { own_index, trustees = [], private_keyshare } = state

  const last_trustees_shuffled = trustees[trustees.length - 1]?.shuffled || {}
  const num_last_shuffled = Object.values(last_trustees_shuffled)[0]?.length
  const num_we_decrypted = Object.values(trustees[own_index]?.partials || {})[0]?.length || 0

  useEffect(() => {
    // If the last trustee has shuffled more than we've decrypted,
    // we should decrypt their final shuffled list.
    if (num_last_shuffled > num_we_decrypted) {
      console.log(
        `Last trusteee has shuffled: ${num_last_shuffled}, We decrypted: ${num_we_decrypted}. Beginning partial decryption...`,
      )

      // Partially decrypt each item in every list
      const partials = mapValues(last_trustees_shuffled as Shuffled, (list) =>
        (list as string[]).map((cipher_string) => {
          const { unlock } = JSON.parse(cipher_string)
          return partial_decrypt(big(unlock), big(private_keyshare!), getParameters(state)).toString()
        }),
      )

      // Tell admin our new partials list
      api(`election/${state.election_id}/keygen/update`, {
        email: state.own_email,
        partials,
        trustee_auth: state.trustee_auth,
      })
    }
  }, [num_last_shuffled])

  return (
    <>
      <h3>IV. Votes to Decrypt</h3>
      <ol>
        {trustees?.map(({ email, partials, you }) => (
          <li key={email}>
            {email}
            {you && <YouLabel />} partially decrypted {!partials ? '0' : Object.values(partials)[0].length} votes.
            {partials && <PartialsTable {...{ partials }} />}
          </li>
        ))}
      </ol>
    </>
  )
}

const PartialsTable = ({ partials }: { partials: Record<string, string[]> }): JSX.Element => {
  const columns = Object.keys(partials)
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          {columns.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {partials[columns[0]].map((_, index) => (
          <tr key={index}>
            <td>{index + 1}.</td>
            {columns.map((key) => {
              return (
                <Fragment key={key}>
                  <td>{partials[key][index]}</td>
                </Fragment>
              )
            })}
          </tr>
        ))}
      </tbody>
      <style jsx>{`
        table {
          border-collapse: collapse;
          display: block;
          overflow: scroll;
          margin-bottom: 15px;
        }

        th,
        td {
          border: 1px solid #ccc;
          padding: 3px 10px;
          margin: 0;
          max-width: 360px;
        }

        th,
        .subheading td {
          font-size: 11px;
          font-weight: 700;
        }
      `}</style>
    </table>
  )
}
