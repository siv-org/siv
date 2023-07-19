import { keyBy } from 'lodash-es'
import TimeAgo from 'timeago-react'

import { tallyVotes } from './tally-votes'
import { unTruncateSelection } from './un-truncate-selection'
import { useDecryptedVotes } from './use-decrypted-votes'
import { useElectionInfo } from './use-election-info'

export const Totals = ({ proofsPage }: { proofsPage?: boolean }): JSX.Element => {
  const { ballot_design, last_decrypted_at } = useElectionInfo()
  const votes = useDecryptedVotes()

  // Stop if we don't have enough data yet
  if (!ballot_design || !votes || !votes.length) return <></>

  const ballot_items_by_id = keyBy(ballot_design, 'id')
  const { ordered, tallies, totalsCastPerItems } = tallyVotes(ballot_items_by_id, votes)

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

          {type === 'ranked-choice-irv' && (
            <div className="p-1 border-2 border-red-400 border-dashed rounded">
              This was a Ranked Choice question. SIV does not yet support Ranked Choice tallying. The numbers below
              represent who received <i>any</i> votes, ignoring rankings.
              <p className="mt-1 mb-0 text-xs text-gray-500">
                You can paste the Decrypted Votes table into a tallying program such as{' '}
                <a href="https://rcvis.com" rel="noreferrer" target="_blank">
                  rcvis.com
                </a>
              </p>
            </div>
          )}

          <ul>
            {ordered[id].map((selection) => (
              <li key={selection}>
                {unTruncateSelection(selection, ballot_design, id)}: {tallies[id][selection]}{' '}
                <i style={{ fontSize: 12, marginLeft: 5, opacity: 0.5 }}>
                  ({((100 * tallies[id][selection]) / totalsCastPerItems[id]).toFixed(1)}%)
                </i>
              </li>
            ))}
          </ul>
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
