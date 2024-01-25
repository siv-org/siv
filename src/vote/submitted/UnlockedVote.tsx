import { unTruncateSelection } from 'src/status/un-truncate-selection'

import { State } from '../vote-state'

export const UnlockedVote = ({ columns, state }: { columns: string[]; state: State }) => (
  <div className="pb-2 overflow-auto">
    <table className="w-auto border-collapse table-auto whitespace-nowrap">
      <thead>
        <tr>
          <th className="p-1 text-[11px] font-bold border border-gray-300 border-solid">verification #</th>
          {columns.map((c) => (
            <th className="p-1 text-[11px] font-bold border border-gray-300 border-solid" key={c}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-1 bg-[#0AE80A44] border border-gray-300 border-solid">
            {state.tracking?.padStart(14, '0')}
          </td>
          {columns.map((c) => {
            const vote = state.plaintext[c]
            return (
              <td className="p-1 border border-gray-300 border-solid max-w-90" key={c}>
                {vote === 'BLANK' ? '' : unTruncateSelection(vote, state.ballot_design || [], c)}
              </td>
            )
          })}
        </tr>
      </tbody>
    </table>
  </div>
)
