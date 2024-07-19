/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LoadingOutlined } from '@ant-design/icons'
import bluebird from 'bluebird'
import { mapValues } from 'lodash-es'
import { Dispatch, Fragment, SetStateAction, useEffect, useReducer, useState } from 'react'
import { RP } from 'src/crypto/curve'
// import { destringifyShuffle, stringifyShuffle } from 'src/crypto/stringify-shuffle'
import { stringifyShuffle } from 'src/crypto/stringify-shuffle'

import { api } from '../../api-helper'
import { shuffle } from '../../crypto/shuffle'
// import { rename_to_c1_and_2, shuffle } from '../../crypto/shuffle'
// import { verify_shuffle_proof } from '../../crypto/shuffle-proof'
import { Shuffled, StateAndDispatch } from '../trustee-state'
import { YouLabel } from '../YouLabel'
import { useTruncatedTable } from './useTruncatedTable'

type Validations_Table = Record<string, { columns: Record<string, boolean | null>; num_votes: number }>

export const VotesToShuffle = ({
  set_final_shuffle_verifies,
  state,
}: StateAndDispatch & { set_final_shuffle_verifies: Dispatch<SetStateAction<boolean>> }) => {
  const { own_index, threshold_public_key, trustees = [] } = state
  const [proofs_shown, set_proofs_shown] = useState<Record<string, boolean>>({})

  /* Object to track which proofs have been validated
  KEY: null=tbd, true=valid, false=invalid
  {
    'admin@siv.org': {
      num_votes: 4,
      columns: {
        president: true,
        mayor: true,
      },
    },
    'trustee_1@': {
      num_votes: 4,
      columns: {
        president: null,
        mayor: false,
      },
    },
  }
  */
  const [validated_proofs, set_validated_proofs] = useReducer(
    (
      prev: Validations_Table,
      action:
        | { columns: Record<string, null>; email: string; num_votes: number; type: 'RESET' }
        | { column: string; email: string; result: boolean; type: 'UPDATE' },
    ): Validations_Table => {
      if (action.type === 'RESET')
        return { ...prev, [action.email]: { columns: action.columns, num_votes: action.num_votes } }
      if (action.type === 'UPDATE') {
        const update = { ...prev }
        update[action.email].columns[action.column] = action.result
        return update
      }

      throw new TypeError('Decryption Validation Table: Unknown Action.type')
    },
    {},
  )
  const num_shuffled_from_trustees = trustees.map(
    ({ shuffled = {} }) => Object.values(shuffled)[0]?.shuffled.length || 0,
  )
  useEffect(() => {
    trustees.forEach(({ email, shuffled = {} }, index) => {
      const num_shuffled = num_shuffled_from_trustees[index]

      // Stop if we already checked this trustee
      if (validated_proofs[email] && validated_proofs[email].num_votes === num_shuffled) return

      if (num_shuffled) console.log(`${email} provided ${num_shuffled} shuffled votes, validating...`)

      const trustee_validations = mapValues(shuffled, () => null)
      set_validated_proofs({ columns: trustee_validations, email, num_votes: num_shuffled, type: 'RESET' })

      // Begin (async) validating each proof...
      Object.keys(trustee_validations).forEach((column) => {
        set_validated_proofs({ column, email, result: true, type: 'UPDATE' })
        // // Inputs are the previous party's outputs
        // // except for admin, who provides the original split list.
        // const inputs = index > 0 ? trustees[index - 1].shuffled![column].shuffled : trustees[0].preshuffled![column]

        // const { proof, shuffled: shuffledCol } = destringifyShuffle(shuffled[column])

        // verify_shuffle_proof(
        //   rename_to_c1_and_2(inputs.map((c) => mapValues(c, RP.fromHex))),
        //   rename_to_c1_and_2(shuffledCol),
        //   proof,
        // ).then((result) => {
        //   set_validated_proofs({ column, email, result, type: 'UPDATE' })
        // })
      })
    })
  }, [num_shuffled_from_trustees])

  const prev_email = trustees[own_index - 1]?.email || ''
  const prev_trustees_shuffled = trustees[own_index - 1]?.shuffled || {}
  const prev_proofs_all_passed = all_proofs_passed(validated_proofs[prev_email])
  const num_prev_shuffled = num_shuffled_from_trustees[own_index - 1]
  const num_we_shuffled = num_shuffled_from_trustees[own_index]

  async function shuffleFromPrevious() {
    console.log(`Prev shuffled: ${num_prev_shuffled}, We shuffled: ${num_we_shuffled}. Shuffling...`)

    // Do a SIV shuffle (permute + re-encryption) for each item's list
    const shuffled = await bluebird.props(
      mapValues(prev_trustees_shuffled, async (list) =>
        stringifyShuffle(
          await shuffle(
            RP.fromHex(threshold_public_key!),
            list.shuffled.map((c) => mapValues(c, RP.fromHex)),
          ),
        ),
      ),
    )
    console.log('Shuffled complete.')

    // Tell admin our new shuffled list
    api(`election/${state.election_id}/trustees/update`, {
      auth: state.auth,
      email: state.own_email,
      shuffled,
    })
  }

  useEffect(() => {
    // If party before us has shuffled more than us,
    // AND their previous shuffle includes a valid ZK Proof,
    // THEN: we should shuffle the list they provided.
    if (num_prev_shuffled > num_we_shuffled && prev_proofs_all_passed) {
      shuffleFromPrevious()
    }
  }, [prev_proofs_all_passed])

  // Update final_shuffle_verifies for VotesToDecrypt
  const final_proofs_all_passed = all_proofs_passed(validated_proofs[trustees[trustees.length - 1]?.email || ''])
  useEffect(() => {
    set_final_shuffle_verifies(final_proofs_all_passed)
  }, [final_proofs_all_passed])

  return (
    <>
      <h3>III. Votes to Shuffle</h3>
      <ol>
        {trustees?.map(({ email, shuffled, you }) => (
          <li key={email}>
            {email}
            {you && <YouLabel />} shuffled {!shuffled ? '0' : Object.values(shuffled)[0].shuffled.length} votes
            {shuffled && ` x ${Object.keys(shuffled).length} columns`}.
            {shuffled && (
              <ValidationSummary {...{ email, proofs_shown, set_proofs_shown, shuffled, validated_proofs }} />
            )}
            {shuffled && (
              <>
                <ShuffledVotesTable {...{ email, shuffled, validated_proofs }} />
                {proofs_shown[email] && <ShuffleProof {...{ shuffled }} />}
              </>
            )}
          </li>
        ))}
      </ol>
      <style jsx>{`
        li {
          margin-bottom: 2rem;
        }
      `}</style>
    </>
  )
}

const ShuffledVotesTable = ({
  email,
  shuffled,
  validated_proofs,
}: {
  email: string
  shuffled: Shuffled
  validated_proofs: Validations_Table
}): JSX.Element => {
  const trustees_validations = validated_proofs && validated_proofs[email]
  const columns = Object.keys(shuffled)

  const { TruncationToggle, rows_to_show } = useTruncatedTable({
    num_cols: columns.length,
    num_rows: Object.values(shuffled)[0].shuffled.length,
  })

  return (
    <>
      <table>
        <thead>
          <tr>
            <th></th>
            {columns.map((c) => {
              const verified = trustees_validations ? trustees_validations.columns[c] : null
              return (
                <th colSpan={2} key={c}>
                  {c} <span>{verified === null ? <LoadingOutlined /> : verified ? '' : '❌'}</span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {/* Column subheadings */}
          <tr className="subheading">
            <td></td>
            {columns.map((c) => (
              <Fragment key={c}>
                <td>encrypted</td>
                <td>lock</td>
              </Fragment>
            ))}
          </tr>
          {shuffled[columns[0]].shuffled.slice(0, rows_to_show).map((_, index) => (
            <tr key={index}>
              <td>{index + 1}.</td>
              {columns.map((key) => {
                const cipher = shuffled[key].shuffled[index]
                return (
                  <Fragment key={key}>
                    <td className="monospaced">{cipher.encrypted}</td>
                    <td className="monospaced">{cipher.lock}</td>
                  </Fragment>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <TruncationToggle />

      <style jsx>{`
        table {
          border-collapse: collapse;
          display: block;
          overflow: auto;
          margin-bottom: 10px;
        }

        th,
        td {
          border: 1px solid #ccc;
          padding: 3px 10px;
          margin: 0;
          max-width: 240px;
        }

        td.monospaced {
          font-family: monospace;
        }

        th,
        .subheading td {
          font-size: 11px;
          font-weight: 700;
        }

        th span {
          padding-left: 5px;
          opacity: 0.6;
        }
      `}</style>
    </>
  )
}

const ShuffleProof = ({ shuffled }: { shuffled: Shuffled }) => (
  <>
    {Object.keys(shuffled).map((column) => (
      <div key={column}>
        <h4>{column}</h4>
        {/* <code>{JSON.stringify(shuffled[column].proof)}</code> */}
      </div>
    ))}
    <style jsx>{`
      code {
        font-size: 13px;
      }
    `}</style>
  </>
)

const ValidationSummary = ({
  email,
  proofs_shown,
  set_proofs_shown,
  validated_proofs,
}: {
  email: string
  proofs_shown: Record<string, boolean>
  set_proofs_shown: Dispatch<SetStateAction<Record<string, boolean>>>
  validated_proofs: Validations_Table
}) => {
  const validations = validated_proofs[email]

  return (
    <i>
      {all_proofs_passed(validations) && '✅ '}
      {num_proofs_passed(validations)} of {num_total_proofs(validations)} Shuffle Proofs verified (
      <a className="show-proof" onClick={() => set_proofs_shown({ ...proofs_shown, [email]: !proofs_shown[email] })}>
        {proofs_shown[email] ? '-Hide' : '+Show'}
      </a>
      )
      <style jsx>{`
        i {
          font-size: 11px;
          display: block;
        }

        @media (min-width: 600px) {
          i {
            float: right;
          }
        }

        .show-proof {
          cursor: pointer;
          font-family: monospace;
        }
      `}</style>
    </i>
  )
}

const num_proofs_passed = (validations: Validations_Table['email']) =>
  !validations ? 0 : Object.values(validations.columns).reduce((sum, column) => sum + Number(column), 0)

const num_total_proofs = (validations: Validations_Table['email']) =>
  (validations && Object.keys(validations.columns).length) || 0

const all_proofs_passed = (validations: Validations_Table['email']) =>
  !!num_proofs_passed(validations) && num_proofs_passed(validations) === num_total_proofs(validations)
