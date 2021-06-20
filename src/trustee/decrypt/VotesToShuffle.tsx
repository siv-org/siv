/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LoadingOutlined } from '@ant-design/icons'
import bluebird from 'bluebird'
import { mapValues } from 'lodash-es'
import { Dispatch, Fragment, SetStateAction, useEffect, useReducer, useState } from 'react'

import { api } from '../../api-helper'
import { shuffle } from '../../crypto/shuffle'
import { Shuffle_Proof, verify_shuffle_proof } from '../../crypto/shuffle-proof'
import { bigCipher, bigPubKey, bigs_to_strs, to_bigs } from '../../crypto/types'
import { Shuffled, StateAndDispatch } from '../trustee-state'
import { YouLabel } from '../YouLabel'

type Validations_Table = Record<string, { columns: Record<string, boolean | null>; num_votes: number }>

export const VotesToShuffle = ({ state }: StateAndDispatch) => {
  const { own_index, trustees = [], parameters, threshold_public_key } = state
  const [proofs_shown, set_proofs_shown] = useState<Record<string, boolean>>({})

  /* Object to track which proofs have been validated
  KEY: null=tbd, true=valid, false=invalid
  {
    'admin@secureinternetvoting.org': {
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
        verify_shuffle_proof(to_bigs(shuffled[column].proof) as Shuffle_Proof).then((result) => {
          set_validated_proofs({ column, email, result, type: 'UPDATE' })
        })
      })
    })
  }, [num_shuffled_from_trustees])

  const { g, p } = parameters!

  const previous_trustees_shuffled = trustees[own_index - 1]?.shuffled || {}
  const num_prev_shuffled = num_shuffled_from_trustees[own_index - 1]
  const num_we_shuffled = num_shuffled_from_trustees[own_index]

  async function shuffleFromPrevious() {
    console.log(`Prev shuffled: ${num_prev_shuffled}, We shuffled: ${num_we_shuffled}. Shuffling...`)
    // Get the election's public key
    const public_key = bigPubKey({ generator: g, modulo: p, recipient: threshold_public_key! })

    // Do a SIV shuffle (permute + re-encryption) for each item's list
    const shuffled = await bluebird.props(
      mapValues(previous_trustees_shuffled, async (list) =>
        bigs_to_strs(await shuffle(public_key, list.shuffled.map(bigCipher))),
      ),
    )

    // Tell admin our new shuffled list
    api(`election/${state.election_id}/trustees/update`, {
      auth: state.auth,
      email: state.own_email,
      shuffled,
    })
  }

  useEffect(() => {
    // If trustee before us has shuffled more than us,
    // AND their previous shuffle includes a valid ZK Proof,
    // THEN: we should shuffle the list they provided.
    if (num_prev_shuffled > num_we_shuffled && isProofValid(previous_trustees_shuffled)) {
      shuffleFromPrevious()
    }
  }, [num_prev_shuffled])

  return (
    <>
      <h3>III. Votes to Shuffle</h3>
      <ol>
        {trustees?.map(({ email, shuffled, you }) => (
          <li key={email}>
            {email}
            {you && <YouLabel />} shuffled {!shuffled ? '0' : Object.values(shuffled)[0].shuffled.length} votes.
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
  return (
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
        {shuffled[columns[0]].shuffled.map((_, index) => (
          <tr key={index}>
            <td>{index + 1}.</td>
            {columns.map((key) => {
              const cipher = shuffled[key].shuffled[index]
              return (
                <Fragment key={key}>
                  <td>{cipher.encrypted}</td>
                  <td>{cipher.unlock}</td>
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
          margin-bottom: 10px;
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

        th span {
          padding-left: 5px;
          opacity: 0.6;
        }
      `}</style>
    </table>
  )
}

const ShuffleProof = ({ shuffled }: { shuffled: Shuffled }) => (
  <>
    {Object.keys(shuffled).map((column) => (
      <>
        <h4>{column}</h4>
        <code>{JSON.stringify(shuffled[column].proof)}</code>
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
  const num_proofs_passed = !validations
    ? 0
    : Object.values(validations.columns).reduce((sum, column) => sum + Number(column), 0)
  const num_total_proofs = (validations && Object.keys(validations.columns).length) || 0

  return (
    <i>
      {!!num_proofs_passed && num_proofs_passed === num_total_proofs && '✅ '}
      {num_proofs_passed} of {num_total_proofs} Shuffle Proofs verified (
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

export const isProofValid = (): boolean => false
