/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bluebird from 'bluebird'
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react'

import { api } from '../../api-helper'
import { generate_partial_decryption_proof, partial_decrypt } from '../../crypto/threshold-keygen'
import { big, bigs_to_strs } from '../../crypto/types'
import { Partial, StateAndDispatch, getParameters } from '../trustee-state'
import { YouLabel } from '../YouLabel'
import { isProofValid as isShuffleProofValid } from './VotesToShuffle'

type Partials = Record<string, Partial[]>

export const VotesToDecrypt = ({ state }: StateAndDispatch) => {
  const { own_index, trustees = [], private_keyshare } = state
  const [proofs_shown, set_proofs_shown] = useState<Record<string, boolean>>({})

  const last_trustees_shuffled = trustees[trustees.length - 1]?.shuffled || {}
  const num_last_shuffled = Object.values(last_trustees_shuffled)[0]?.shuffled.length
  const num_we_decrypted = Object.values(trustees[own_index]?.partials || {})[0]?.length || 0

  const parameters = getParameters(state)

  async function partialDecryptFinalShuffle() {
    console.log(
      `Last trusteee has shuffled: ${num_last_shuffled}, We decrypted: ${num_we_decrypted}. Beginning partial decryption...`,
    )

    // Partially decrypt each item in every list
    const partials = await bluebird.reduce(
      Object.keys(last_trustees_shuffled),
      (acc: Partials, column) =>
        bluebird.props({
          ...acc,
          [column]: bluebird.map(last_trustees_shuffled[column].shuffled, async ({ unlock }) =>
            bigs_to_strs({
              partial: partial_decrypt(big(unlock), big(private_keyshare!), parameters),
              proof: await generate_partial_decryption_proof(big(unlock), big(private_keyshare!), parameters),
            }),
          ),
        }),
      {},
    )

    // Tell admin our new partials list
    api(`election/${state.election_id}/trustees/update`, {
      auth: state.auth,
      email: state.own_email,
      partials,
    })
  }

  useEffect(() => {
    // If the last trustee has shuffled more than we've decrypted,
    // AND provided valid ZK Proof,
    // we should decrypt their final shuffled list.
    if (num_last_shuffled > num_we_decrypted && isShuffleProofValid(last_trustees_shuffled)) {
      partialDecryptFinalShuffle()
    }
  }, [num_last_shuffled])

  return (
    <>
      <h3>IV. Votes to Decrypt</h3>
      <ol>
        {trustees?.map(({ email, partials, you }) => (
          <li key={email}>
            <div>
              <span className="left">
                {email}
                {you && <YouLabel />} partially decrypted {!partials ? 0 : Object.values(partials)[0].length} votes.
              </span>

              {partials && (
                <ProofValidation
                  {...{ email, last_trustees_shuffled, parameters, partials, proofs_shown, set_proofs_shown }}
                />
              )}
            </div>

            {partials && (
              <>
                <PartialsTable {...{ partials }} />
                {proofs_shown[email] && <DecryptionProof {...{ partials }} />}
              </>
            )}
          </li>
        ))}
      </ol>
      <style jsx>{`
        li {
          margin-bottom: 3rem;
        }
      `}</style>
    </>
  )
}

const PartialsTable = ({ partials }: { partials: Partials }): JSX.Element => {
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
                  <td>{partials[key][index].partial}</td>
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

const DecryptionProof = ({ partials }: { partials: Partials }) => (
  <>
    {Object.keys(partials).map((column) => (
      <>
        <h4>{column}</h4>
        <code>{JSON.stringify(partials[column])}</code>
      </>
    ))}
    <style jsx>{`
      code {
        white-space: pre;
        font-size: 13px;
      }
    `}</style>
  </>
)

const ProofValidation = ({
  email,
  partials,
  proofs_shown,
  set_proofs_shown,
}: {
  email: string
  partials: Partials
  proofs_shown: Record<string, boolean>
  set_proofs_shown: Dispatch<SetStateAction<Record<string, boolean>>>
}) => {
  const num_votes_decrypted = !partials ? 0 : Object.values(partials)[0].length
  const num_partials_passed = 0
  const num_total_partials = !partials ? 0 : num_votes_decrypted * Object.keys(partials).length

  return (
    <i className="right">
      {!!num_partials_passed && num_partials_passed === num_total_partials && '✅ '}
      {num_partials_passed} of {num_total_partials} Decryption Proofs validated (
      <a className="show-proof" onClick={() => set_proofs_shown({ ...proofs_shown, [email]: !proofs_shown[email] })}>
        {proofs_shown[email] ? '-Hide' : '+Show'}
      </a>
      )
      <style jsx>{`
        i {
          font-size: 11px;
          float: right;
        }

        .show-proof {
          cursor: pointer;
          font-family: monospace;
        }
      `}</style>
    </i>
  )
}

// const g_to_trustees_secret = '10'

// export function isProofValid(last_trustees_shuffled: Shuffled, partials: Partials, parameters: Parameters): boolean {
//   return Object.keys(partials).every((column) =>
//     partials[column].every((cell, rowIndex) => {
//       return verify_partial_decryption_proof(
//         big(last_trustees_shuffled[column].shuffled[rowIndex].unlock),
//         big(g_to_trustees_secret),
//         big(cell.partial),
//         to_bigs(cell.proof) as { g_to_secret_r: Big; obfuscated_trustee_secret: Big; unlock_to_secret_r: Big },
//         parameters,
//       )
//     }),
//   )
// }
