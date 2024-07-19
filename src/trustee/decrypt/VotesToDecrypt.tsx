/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LoadingOutlined } from '@ant-design/icons'
import bluebird from 'bluebird'
import { mapValues } from 'lodash-es'
import { Dispatch, SetStateAction, useEffect, useReducer, useState } from 'react'
import { RP } from 'src/crypto/curve'
import { destringifyPartial, stringifyPartial } from 'src/crypto/stringify-partials'

import { api } from '../../api-helper'
import {
  compute_g_to_keyshare,
  generate_partial_decryption_proof,
  partial_decrypt,
  verify_partial_decryption_proof,
} from '../../crypto/threshold-keygen'
import { Partial, StateAndDispatch } from '../trustee-state'
import { YouLabel } from '../YouLabel'
import { useTruncatedTable } from './useTruncatedTable'
import { sortColumnsForTrustees } from './VotesToShuffle'

type Partials = Record<string, Partial[]>
type Validations_Table = Record<string, Record<string, (boolean | null)[]>>

export const VotesToDecrypt = ({
  final_shuffle_verifies,
  state,
}: StateAndDispatch & { final_shuffle_verifies: boolean }) => {
  const { own_index, private_keyshare, trustees = [] } = state
  const [proofs_shown, set_proofs_shown] = useState<Record<string, boolean>>({})

  /* Object to track which proofs have been validated
  KEY: null=tbd, true=valid, false=invalid
  {
    'admin@siv.org': {
      president: [null, null, null, null],
      mayor: [null, null, null, null]
    },
    'trustee_1@': {
      president: [true, false, null, null],
      mayor: [null, null, null, null]
    },
  }
  */
  const [validated_proofs, set_validated_proofs] = useReducer(
    (
      prev: Validations_Table,
      action:
        | { email: string; payload: Record<string, null[]>; type: 'RESET' }
        | { column: string; email: string; result: boolean; type: 'UPDATE'; voteIndex: number },
    ): Validations_Table => {
      if (action.type === 'RESET') return { ...prev, [action.email]: action.payload }
      if (action.type === 'UPDATE') {
        const update = { ...prev }
        update[action.email][action.column][action.voteIndex] = action.result
        return update
      }

      throw new TypeError('Decryption Validation Table: Unknown Action.type')
    },
    {},
  )
  const num_partials_from_trustees = trustees.map(({ partials = {} }) => (Object.values(partials)[0] || []).length)
  const all_Broadcasts = trustees.map(({ commitments }) => commitments.map(RP.fromHex))
  useEffect(() => {
    trustees.forEach(({ email, partials = {} }, index) => {
      const num_partials = num_partials_from_trustees[index]

      // Stop if we already checked this trustee
      if (
        !num_partials ||
        (validated_proofs[email] && Object.values(validated_proofs[email])[0].length === num_partials)
      )
        return

      if (num_partials) console.log(`${email} provided ${num_partials} partials, validating...`)

      const trustee_validations = mapValues(partials, (column) => column.map(() => null))
      set_validated_proofs({ email, payload: trustee_validations, type: 'RESET' })

      const g_to_trustees_keyshare = compute_g_to_keyshare(index + 1, all_Broadcasts)

      // Begin (async) validating each proof...
      Object.keys(trustee_validations).forEach((column) => {
        trustee_validations[column].forEach((_, voteIndex) => {
          const { partial, proof } = partials[column][voteIndex]
          verify_partial_decryption_proof(
            RP.fromHex(last_trustees_shuffled[column].shuffled[voteIndex].lock),
            g_to_trustees_keyshare,
            RP.fromHex(partial),
            destringifyPartial(proof),
          ).then((result) => {
            set_validated_proofs({ column, email, result, type: 'UPDATE', voteIndex })
          })
        })
      })
    })
  }, [num_partials_from_trustees])

  const last_trustees_shuffled = trustees[trustees.length - 1]?.shuffled || {}
  const num_last_shuffled = Object.values(last_trustees_shuffled)[0]?.shuffled.length
  const num_we_decrypted = Object.values(trustees[own_index]?.partials || {})[0]?.length || 0

  async function partialDecryptFinalShuffle() {
    console.log(
      `Last trustee has shuffled: ${num_last_shuffled}, We decrypted: ${num_we_decrypted}. Beginning partial decryption...`,
    )

    // Partially decrypt each item in every list
    const partials = await bluebird.reduce(
      Object.keys(last_trustees_shuffled),
      (acc: Partials, column) =>
        bluebird.props({
          ...acc,
          [column]: bluebird.map(last_trustees_shuffled[column].shuffled, async ({ lock }) => ({
            partial: partial_decrypt(RP.fromHex(lock), BigInt(private_keyshare!)).toHex(),
            proof: stringifyPartial(
              await generate_partial_decryption_proof(RP.fromHex(lock), BigInt(private_keyshare!)),
            ),
          })),
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
    if (num_last_shuffled > num_we_decrypted && final_shuffle_verifies) {
      partialDecryptFinalShuffle()
    }
  }, [final_shuffle_verifies])

  return (
    <>
      <h3>IV. Votes to Decrypt</h3>
      <ol className="pl-5">
        {trustees?.map(({ email, partials, you }) => (
          <li className="mb-8" key={email}>
            {/* Top row */}
            <div className="flex flex-col justify-between sm:flex-row">
              {/* Left */}
              <span>
                {email}
                {you && <YouLabel />} partially decrypted {!partials ? 0 : Object.values(partials)[0].length}
                &nbsp;votes.
              </span>
              {/* Right */}
              {partials && (
                <ValidationSummary {...{ email, partials, proofs_shown, set_proofs_shown, validated_proofs }} />
              )}
            </div>
            {partials && (
              <>
                <PartialsTable {...{ email, partials, validated_proofs }} />
                {proofs_shown[email] && <DecryptionProof {...{ partials }} />}
              </>
            )}
          </li>
        ))}
      </ol>
    </>
  )
}

const PartialsTable = ({
  email,
  partials,
  validated_proofs,
}: {
  email: string
  partials: Partials
  validated_proofs: Validations_Table
}): JSX.Element => {
  const trustees_validations = validated_proofs[email]
  if (!trustees_validations) return <></>
  const columns = sortColumnsForTrustees(Object.keys(partials))
  const { TruncationToggle, rows_to_show } = useTruncatedTable({
    num_cols: columns.length,
    num_rows: Object.values(partials)[0].length,
  })

  return (
    <>
      <table className="block w-full pb-3 overflow-auto border-collapse [&_tr>*]:[border:1px_solid_#ccc] [&_tr>*]:px-2.5 [&_tr>td]:pr-5 [&_tr>*]:py-[3px]">
        <thead className="text-[11px] text-center">
          <tr>
            <th></th>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody className="[&>tr>*]:max-w-[239px]">
          {partials[columns[0]].slice(0, rows_to_show).map((_, index) => (
            <tr key={index}>
              <td className="!pr-2.5">{index + 1}.</td>
              {columns.map((key) => {
                const validated = trustees_validations[key][index]
                return (
                  <td className="font-mono text-[10px]" key={key}>
                    <div className="relative">
                      {partials[key][index].partial}{' '}
                      <span className="absolute top-2 -right-3.5 text-[10px] opacity-30">
                        {validated === null ? <LoadingOutlined /> : validated ? '' : '❌'}
                      </span>
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <TruncationToggle />
    </>
  )
}

const DecryptionProof = ({ partials }: { partials: Partials }) => (
  <>
    {Object.keys(partials).map((column) => (
      <div key={column}>
        <h4>{column}</h4>
        <code className="text-[13px]">{JSON.stringify(partials[column])}</code>
      </div>
    ))}
  </>
)

const ValidationSummary = ({
  email,
  partials,
  proofs_shown,
  set_proofs_shown,
  validated_proofs,
}: {
  email: string
  partials: Partials
  proofs_shown: Record<string, boolean>
  set_proofs_shown: Dispatch<SetStateAction<Record<string, boolean>>>
  validated_proofs: Validations_Table
}) => {
  const num_votes_decrypted = !partials ? 0 : Object.values(partials)[0].length
  const num_partials_passed = !validated_proofs[email]
    ? 0
    : Object.values(validated_proofs[email]).reduce(
        (sum, list) => sum + list.reduce((listSum, item) => listSum + Number(item), 0),
        0,
      )
  const num_total_partials = !partials ? 0 : num_votes_decrypted * Object.keys(partials).length

  return (
    <i className="sm:text-right text-[11px] block">
      {!!num_partials_passed && num_partials_passed === num_total_partials && '✅ '}
      {num_partials_passed} of {num_total_partials} Decryption Proofs verified (
      <a
        className="font-mono cursor-pointer"
        onClick={() => set_proofs_shown({ ...proofs_shown, [email]: !proofs_shown[email] })}
      >
        {proofs_shown[email] ? '-Hide' : '+Show'}
      </a>
      )
    </i>
  )
}
