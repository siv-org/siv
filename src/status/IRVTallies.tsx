import { Item } from 'src/vote/storeElectionInfo'

import { RoundResults } from './RoundResults'
import { tally_IRV_Items } from './tallying/rcv-irv'
import { unTruncateSelection } from './un-truncate-selection'

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
          Winner: <b className="font-semibold">{unTruncateSelection(results.winner, ballot_design, id)}</b>{' '}
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

            <CheckForTies {...{ index, ordered: round.ordered, tallies: round.tallies }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Component to check and warn about ambiguity if there's a tie among who to eliminate */
const CheckForTies = ({
  index,
  ordered,
  tallies,
}: {
  index: number
  ordered: string[]
  tallies: Record<string, number>
}) => {
  const last_place = ordered.at(-1)
  if (!last_place) return <></>
  const last_votes = tallies[last_place]

  const second_last_place = ordered.at(-2)
  if (!second_last_place) return <></>
  const second_last_votes = tallies[second_last_place]

  if (last_votes !== second_last_votes) return <></>

  return (
    <div
      className="px-1 ml-5 border border-yellow-400 border-solid rounded cursor-pointer text-black/70 hover:bg-yellow-50"
      onClick={() =>
        alert(
          `Round ${
            index + 1
          } has multiple tying bottom options.\n\nCurrently, the alphabetically-last gets eliminated, but your election may require different rules.`,
        )
      }
    >
      Tie among bottom choices.{' '}
      <span className="px-[4.25px] border border-solid rounded-full opacity-50 text-xs">?</span>
    </div>
  )
}
