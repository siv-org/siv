import { Fragment } from 'react'

import { State } from '../vote-state'

export const EncryptedVote = ({ auth, columns, state }: { auth: string; columns: string[]; state: State }) => (
  <div>
    <table>
      <thead>
        <tr>
          <th>auth</th>
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
        <tr>
          <td>{auth}</td>
          {columns.map((key) => (
            <Fragment key={key}>
              <td className="monospaced text-[11px]">{state.encrypted[key]?.encrypted}</td>
              <td className="monospaced text-[11px]">{state.encrypted[key]?.lock}</td>
            </Fragment>
          ))}
        </tr>
      </tbody>
    </table>
    <style jsx>{`
      table {
        border-collapse: collapse;
        display: block;
        overflow: auto;
        overflow-wrap: break-word;
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
    `}</style>
  </div>
)
