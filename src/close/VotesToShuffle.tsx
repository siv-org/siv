import { Fragment } from 'react'

import { Shuffled, StateAndDispatch } from '../key-generation/keygen-state'
import { YouLabel } from '../key-generation/YouLabel'

export const VotesToShuffle = ({ state }: StateAndDispatch) => {
  return (
    <>
      <h3>III. Votes to Shuffle</h3>
      <ol>
        {state.trustees?.map(({ email, shuffled, you }) => (
          <li key={email}>
            {email}
            {you && <YouLabel />} shuffled {!shuffled ? '0' : Object.values(shuffled)[0].length} votes.
            {shuffled && <ShuffledVotesTable {...{ shuffled }} />}
          </li>
        ))}
      </ol>
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
              <td>unlock</td>
            </Fragment>
          ))}
        </tr>
        {shuffled[columns[0]].map((_, index) => (
          <tr key={index}>
            <td>{index + 1}.</td>
            {columns.map((key) => {
              const cipher = JSON.parse(shuffled[key][index])
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
