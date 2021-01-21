import { State } from '../vote-state'

export const UnlockedVote = ({ columns, state }: { columns: string[]; state: State }) => (
  <div>
    <table>
      <thead>
        <tr>
          <th>tracking #</th>
          {columns.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{state.tracking?.padStart(14, '0')}</td>
          {columns.map((c) => (
            <td key={c}>{state.plaintext[c]?.toUpperCase()}</td>
          ))}
        </tr>
      </tbody>
    </table>
    <style jsx>{`
      table {
        border-collapse: collapse;
        display: block;
        overflow: scroll;
        overflow-wrap: break-word;
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
  </div>
)
