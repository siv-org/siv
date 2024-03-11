import { Item } from 'src/vote/storeElectionInfo'

import { RoundResults } from './RoundResults'
import { tally_IRV_Items } from './tallying/rcv-irv'

export const IRVTallies = ({
  ballot_design,
  id,
  results,
}: {
  ballot_design: Item[]
  id: string
  results: ReturnType<typeof tally_IRV_Items>[string]
}) => {
  return (
    <div>
      {results.winner && (
        <div>
          Winner: <b className="font-semibold">{results.winner}</b>{' '}
          <span className="text-xs opacity-50">
            (after {results.rounds.length} round
            {results.rounds.length === 1 ? '' : 's'})
          </span>
        </div>
      )}

      {/* Horizontal list of rounds */}
      <div className="flex -ml-5">
        {results.rounds.map((round, index) => (
          // Vertical round results
          <div key={index}>
            <div className="pl-5 mt-3 text-xs opacity-50">Round {index + 1}</div>
            <RoundResults
              {...{ ballot_design, id, ordered: round.ordered, tallies: round.tallies, totalVotes: round.totalVotes }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
