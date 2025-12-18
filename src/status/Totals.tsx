import { keyBy } from 'lodash-es'
import TimeAgo from 'timeago-react'

import { IRVTallies } from './IRVTallies'
import { PaperTotals } from './PaperTotals'
import { RoundResults } from './RoundResults'
import { ScoreTallies } from './ScoreTallies'
import { tallyVotes } from './tally-votes'
import { useDecryptedVotes } from './use-decrypted-votes'
import { useElectionInfo } from './use-election-info'

export const Totals = ({ proofsPage }: { proofsPage?: boolean }): JSX.Element => {
  const { ballot_design, last_decrypted_at, paper_totals, paper_votes } = useElectionInfo()
  const votes = useDecryptedVotes()

  // Stop if we don't have enough data yet
  if (!ballot_design || !votes || !votes.length) return <></>

  const ballot_items_by_id = keyBy(ballot_design, 'id')
  const { irv, ordered, tallies, totalsCastPerItems } = tallyVotes(ballot_items_by_id, votes)

  return (
    <>
      <div
        className={`p-4 bg-white rounded-lg ${custom_box_shadow}`}
        style={{ display: proofsPage ? 'inline-block' : undefined }}
      >
        <div className="flex justify-between items-baseline">
          <h3 className="mt-0">{paper_totals ? 'Digital' : ''} Vote Totals:</h3>
          {last_decrypted_at && !proofsPage && (
            <span className="text-[11px] opacity-50 text-right italic">
              Last updated: <TimeAgo datetime={last_decrypted_at} opts={{ minInterval: 60 }} />
            </span>
          )}
        </div>
        {ballot_design.map(({ id = 'vote', options, title, type }) => (
          <div key={id}>
            <h4>{title}</h4>

            {type === 'ranked-choice-irv' ? (
              <IRVTallies {...{ ballot_design, id, results: irv[id] }} />
            ) : type === 'score' ? (
              <ScoreTallies {...{ id, options, votes }} />
            ) : (
              <RoundResults
                {...{
                  ballot_design,
                  id,
                  ordered: ordered[id],
                  tallies: tallies[id],
                  totalVotes: type === 'approval' ? votes.length : totalsCastPerItems[id],
                }}
              />
            )}
          </div>
        ))}
      </div>

      <PaperTotals {...{ paper_totals, paper_votes }} />
    </>
  )
}

const custom_box_shadow =
  'shadow-[0px_1px_2px_hsl(0_0%_50%/_0.333),0px_3px_4px_hsl(0_0%_50%/_0.333),0px_4px_6px_hsl(0_0%_50%/_0.333)]'
