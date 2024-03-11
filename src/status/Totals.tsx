import { keyBy } from 'lodash-es'
import TimeAgo from 'timeago-react'

import { IRVTallies } from './IRVTallies'
import { RoundResults } from './RoundResults'
import { tallyVotes } from './tally-votes'
import { useDecryptedVotes } from './use-decrypted-votes'
import { useElectionInfo } from './use-election-info'

export const Totals = ({ proofsPage }: { proofsPage?: boolean }): JSX.Element => {
  const { ballot_design, last_decrypted_at } = useElectionInfo()
  const votes = useDecryptedVotes()

  // Stop if we don't have enough data yet
  if (!ballot_design || !votes || !votes.length) return <></>

  const ballot_items_by_id = keyBy(ballot_design, 'id')
  const { irv, ordered, tallies, totalsCastPerItems } = tallyVotes(ballot_items_by_id, votes)

  return (
    <div className="totals" style={{ display: proofsPage ? 'inline-block' : undefined }}>
      <div className="title-line">
        <h3>Vote Totals:</h3>
        {last_decrypted_at && !proofsPage && (
          <span>
            Last updated: <TimeAgo datetime={last_decrypted_at} opts={{ minInterval: 60 }} />
          </span>
        )}
      </div>
      {ballot_design.map(({ id = 'vote', title, type }) => (
        <div key={id}>
          <h4>{title}</h4>

          {type === 'ranked-choice-irv' ? (
            <IRVTallies {...{ ballot_design, id, results: irv[id] }} />
          ) : (
            <RoundResults
              {...{ ballot_design, id, ordered: ordered[id], tallies: tallies[id], totalVotes: totalsCastPerItems[id] }}
            />
          )}
        </div>
      ))}
      <style jsx>{`
        .totals {
          background: #fff;
          border-radius: 8px;
          padding: 1rem;

          box-shadow: 0px 1px 2px hsl(0 0% 50% / 0.333), 0px 3px 4px hsl(0 0% 50% / 0.333),
            0px 4px 6px hsl(0 0% 50% / 0.333);
        }

        .title-line {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        h3 {
          margin-top: 0;
        }

        span {
          font-size: 11px;
          opacity: 0.5;
          text-align: right;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}
