import { orderBy } from 'lodash-es'
import { generateColumnNames } from 'src/vote/generateColumnNames'

import { unTruncateSelection } from './un-truncate-selection'
import { useDecryptedVotes } from './use-decrypted-votes'
import { useElectionInfo } from './use-election-info'

export const DecryptedVotes = ({ proofsPage }: { proofsPage?: boolean }): JSX.Element => {
  const votes = useDecryptedVotes()
  const { ballot_design } = useElectionInfo()

  if (!votes || !votes.length || !ballot_design) return <></>

  const sorted_votes = orderBy(votes, 'tracking')

  const { columns } = generateColumnNames({ ballot_design })

  return (
    <div className="bg-white p-4 rounded-lg shadow-[0_2px_2px_hsla(0,0%,50%,0.333),0_4px_4px_hsla(0,0%,50%,0.333),0_6px_6px_hsla(0,0%,50%,0.333)]">
      {!proofsPage && (
        <>
          <h3>Decrypted Votes</h3> <p>Anonymized for vote secrecy.</p>
        </>
      )}
      <table>
        <thead>
          <tr>
            <th></th>
            <th style={{ backgroundColor: 'rgba(10, 232, 10, 0.24)' }}>verification #</th>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted_votes.map((vote, index) => (
            <tr key={index}>
              <td>{index + 1}.</td>
              <td>{vote.tracking?.padStart(14, '0')}</td>
              {columns.map((c) => (
                <td className="text-center" key={c}>
                  {unTruncateSelection(vote[c], ballot_design, c)}

                  {/* Fix centering for negative Scores */}
                  {vote[c]?.match(/^-\d$/) && <span className="inline-block w-1.5" />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        h3 {
          margin: 0 0 5px;
        }

        p {
          margin-top: 0px;
          font-size: 13px;
          font-style: italic;
          opacity: 0.7;
        }

        table {
          border-collapse: collapse;
          display: block;
          overflow: auto;
        }

        th,
        td {
          border: 1px solid #ccc;
          padding: 3px 10px;
          margin: 0;
        }

        th {
          font-size: 11px;
        }
      `}</style>
    </div>
  )
}
