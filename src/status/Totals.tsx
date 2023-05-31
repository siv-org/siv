import { keyBy } from 'lodash-es'
import TimeAgo from 'timeago-react'

import { tallyVotes } from './tally-votes'
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
      {ballot_design.map(({ id = 'vote', title }) => (
        <div key={id}>
          <h4>{title}</h4>
          <ul>
            {ordered[id].map((selection) => (
              <li key={selection}>
                {selection}: {tallies[id][selection]}{' '}
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
