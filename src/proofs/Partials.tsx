import { flatten } from 'lodash-es'

import { useElectionInfo } from '../status/use-election-info'
import { useTrusteeData } from './useTrusteeData'

export const Partials = (): JSX.Element => {
  const { ballot_design } = useElectionInfo()
  const { trustees = [] } = useTrusteeData()

  if (!trustees.length || !ballot_design) return <></>

  const columns = flatten(
    ballot_design.map(({ id, multiple_votes_allowed }) => {
      return multiple_votes_allowed
        ? new Array(multiple_votes_allowed).fill('').map((_, index) => `${id || 'vote'}_${index + 1}`)
        : id || 'vote'
    }),
  )

  return (
    <div>
      {trustees.map(({ index, name, partials }) => (
        <>
          <p>
            Trustee #{index + 1}: {name}
          </p>
          <table key={index}>
            <thead>
              <tr>
                <th></th>
                {columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {partials &&
                partials[columns[0]].map((partial, index) => (
                  <tr key={index}>
                    <td>{index + 1}.</td>
                    {columns.map((c) => (
                      <td key={c}>{partial.partial}</td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      ))}
      <style jsx>{`
        table {
          border-collapse: collapse;
          display: block;
          overflow: scroll;
          margin-bottom: 30px;
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
