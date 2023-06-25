import { orderBy } from 'lodash-es'
import { flatten } from 'lodash-es'
import { stringToPoint } from 'src/crypto/curve'

import { useDecryptedVotes } from '../status/use-decrypted-votes'
import { useElectionInfo } from '../status/use-election-info'

export const EncodedsTable = (): JSX.Element => {
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
      <table>
        <thead>
          <tr>
            <th></th>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted_votes.map((vote, index) => (
            <tr key={index}>
              <td>{index + 1}.</td>
              {columns.map((c) => (
                <td key={c}>{stringToPoint(`${vote.tracking}:${vote[c]}`)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
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
