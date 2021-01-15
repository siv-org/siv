import { orderBy } from 'lodash-es'
import TimeAgo from 'timeago-react'

import { mapValues } from '../utils'
import { Item } from '../vote/useElectionInfo'

export const Totals = ({
  ballot_design,
  last_decrypted_at,
  votes,
}: {
  ballot_design: Item[]
  last_decrypted_at?: Date
  votes: Record<string, string>[]
}): JSX.Element => {
  const tallies: Record<string, Record<string, number>> = {}
  // Sum up votes
  votes.forEach((vote) => {
    Object.keys(vote).forEach((key) => {
      // Skip 'tracking' key
      if (key === 'tracking') return

      // Init item if new
      tallies[key] = tallies[key] || {}

      // Init selection if new
      tallies[key][vote[key]] = tallies[key][vote[key]] || 0

      // Increment by 1
      tallies[key][vote[key]]++
    })
  })

  // Sort each item's totals from highest to lowest, with ties sorted alphabetically
  const ordered = mapValues(tallies, (item_totals, item_id) =>
    orderBy(
      orderBy(Object.keys(item_totals as Record<string, number>)),
      (selection) => tallies[item_id][selection],
      'desc',
    ),
  ) as Record<string, string[]>

  return (
    <div className="totals">
      <div className="title-line">
        <h3>Vote Totals:</h3>
        {last_decrypted_at && (
          <span>
            Last Updated: <TimeAgo datetime={last_decrypted_at} opts={{ minInterval: 60 }} />
          </span>
        )}
      </div>
      {ballot_design.map(({ id = 'vote', title }) => (
        <div key={id}>
          {Object.keys(tallies).length > 1 && <h4>{title}</h4>}
          <ul>
            {ordered[id].map((selection) => (
              <li key={selection}>
                {selection}: {tallies[id][selection]}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <style jsx>{`
        .totals {
          background: #f9f9f9;
          border: 2px solid #ddd;
          border-radius: 7px;
          padding: 1rem;
        }

        .title-line {
          display: flex;
          justify-content: space-between;
        }

        h3 {
          margin-top: 0;
        }

        span {
          font-size: 11px;
          opacity: 0.5;
        }
      `}</style>
    </div>
  )
}
