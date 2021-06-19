/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LoadingOutlined } from '@ant-design/icons'
import bluebird from 'bluebird'
import { Fragment, useEffect, useState } from 'react'

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
              partial: partial_decrypt(big(unlock), big(private_keyshare!), getParameters(state)),
              proof: await generate_partial_decryption_proof(big(unlock), big(private_keyshare!), getParameters(state)),
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
            {email}
            {you && <YouLabel />} partially decrypted {!partials ? '0' : Object.values(partials)[0].length} votes.
            {partials && (
              <>
                <PartialsTable {...{ partials }} />
                <i>
                  They provided a ZK Proof of a Valid Partial Decryption. (
                  <a
                    className="show-proof"
                    onClick={() => set_proofs_shown({ ...proofs_shown, [email]: !proofs_shown[email] })}
                  >
                    {proofs_shown[email] ? '- Hide' : '+ Show'}
                  </a>
                  ) <ProofValidation {...{ partials }} />
                </i>
                {proofs_shown[email] && <DecryptionProof {...{ partials }} />}
              </>
            )}
          </li>
        ))}
      </ol>
      <style jsx>{`
        li {
          margin-bottom: 1rem;
        }

        i {
          font-size: 11px;
        }

        .show-proof {
          cursor: pointer;
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

const ProofValidation = ({ partials }: { partials: Record<string, Partial[]> }) => {
  type ValidationState = 'validating' | 'valid' | 'invalid'

  const [state, setState] = useState<ValidationState>('validating')

  useEffect(() => {
    setState(isProofValid(partials) ? 'valid' : 'invalid')
  }, [])

  return (
    <>
      {state === 'validating' && (
        <>
          &nbsp;
          <LoadingOutlined />
          &nbsp;&nbsp; Validating...
        </>
      )}
      {state === 'valid' && '  ✅ Validated'}
      {state === 'invalid' && '  ❌ Invalid!'}
    </>
  )
}

export function isProofValid(partials: Record<string, Partial[]>): boolean {
  return false
  return Object.keys(partials).every((column) => verify_shuffle_proof(to_bigs(shuffled[column].proof) as Shuffle_Proof))
}
