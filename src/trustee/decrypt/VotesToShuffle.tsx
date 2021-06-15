import bluebird from 'bluebird'
import { mapValues } from 'lodash-es'
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Fragment, useEffect } from 'react'

import { api } from '../../api-helper'
import { shuffle } from '../../crypto/shuffle'
import { bigCipher, bigPubKey, bigs_to_strs } from '../../crypto/types'
import { Shuffled, StateAndDispatch } from '../trustee-state'
import { YouLabel } from '../YouLabel'

export const VotesToShuffle = ({ state }: StateAndDispatch) => {
  const { own_index, trustees = [], parameters, threshold_public_key } = state
  const { g, p } = parameters!

  const previous_trustees_shuffled = trustees[own_index - 1]?.shuffled || {}
  const num_prev_shuffled = Object.values(previous_trustees_shuffled)[0]?.shuffled.length
  const num_we_shuffled = Object.values(trustees[own_index]?.shuffled || {})[0]?.shuffled.length || 0

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
    // we should shuffle the list they provided.
    if (num_prev_shuffled > num_we_shuffled) {
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
            {shuffled && <ShuffledVotesTable {...{ shuffled }} />}
            {shuffled && <i>They provided a ZK Proof of a Valid Shuffle. Validating...</i>}
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
      `}</style>
    </>
  )
}

const ShuffledVotesTable = ({ shuffled }: { shuffled: Shuffled }): JSX.Element => {
  const columns = Object.keys(shuffled)
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          {columns.map((c) => (
            <th colSpan={2} key={c}>
              {c}
            </th>
          ))}
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
      `}</style>
    </table>
  )
}
