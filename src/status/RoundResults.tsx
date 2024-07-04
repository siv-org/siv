import { Item } from 'src/vote/storeElectionInfo'

import { unTruncateSelection } from './un-truncate-selection'

export const RoundResults = ({
  ballot_design,
  id,
  ordered,
  tallies,
  totalVotes,
}: {
  ballot_design: Item[]
  id: string
  ordered: string[]
  tallies: Record<string, number>
  totalVotes: number
}) => {
  return (
    <ul>
      {ordered?.map((selection) => (
        <li key={selection}>
          {unTruncateSelection(selection, ballot_design, id)}: {tallies[selection]}{' '}
          <i className="opacity-50 text-[12px] ml-1">({((100 * tallies[selection]) / totalVotes).toFixed(1)}%)</i>
        </li>
      ))}
    </ul>
  )
}
