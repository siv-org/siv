import { orderBy } from 'lodash-es'
import { flatten } from 'lodash-es'

import { useDecryptedVotes } from './use-decrypted-votes'
import { useElectionInfo } from './use-election-info'

export const DecryptedVotes = ({ proofsPage }: { proofsPage?: boolean }): JSX.Element => {
  const votes = useDecryptedVotes()
  const { ballot_design } = useElectionInfo()

  if (!votes || !votes.length || !ballot_design) return <></>

  const sorted_votes = orderBy(votes, 'tracking')

  const columns = flatten(
    ballot_design.map(({ id, multiple_votes_allowed }) => {
      return multiple_votes_allowed
        ? new Array(multiple_votes_allowed).fill('').map((_, index) => `${id || 'vote'}_${index + 1}`)
        : id || 'vote'
    }),
  )

  return (
    <div>
      {!proofsPage && (
        <>
          <h3>Decrypted Votes</h3> <p>Anonymized for vote secrecy.</p>
        </>
      )}
      <table>
        <thead>
          <tr>
            <th></th>
            <th>verification #</th>
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
                <td key={c}>{vote[c]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        div {
          background: #fff;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0px 2px 2px hsl(0 0% 50% / 0.333), 0px 4px 4px hsl(0 0% 50% / 0.333),
            0px 6px 6px hsl(0 0% 50% / 0.333);
        }

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
          overflow: scroll;
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
