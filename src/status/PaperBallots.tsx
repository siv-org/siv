import { generateColumnNames } from 'src/vote/generateColumnNames'

import { useElectionInfo } from './use-election-info'

export const PaperBallots = () => {
  const { ballot_design, paper_votes } = useElectionInfo()

  if (!paper_votes || !paper_votes.length || !ballot_design) return <></>

  const { columns } = generateColumnNames({ ballot_design })

  return (
    <div className="mt-8 bg-white p-4 rounded-lg shadow-[0_2px_2px_hsla(0,0%,50%,0.333),0_4px_4px_hsla(0,0%,50%,0.333),0_6px_6px_hsla(0,0%,50%,0.333)]">
      <h2>Paper Ballots</h2>

      <table className="block overflow-auto border-collapse [&_tr>*]:[border:1px_solid_#ccc] [&_tr>*]:px-2.5 [&_tr>*]:py-[3px] pb-2">
        <thead>
          <tr className="text-[11px]">
            <th></th>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paper_votes.map((vote, voteIndex) => (
            <tr key={voteIndex}>
              <td>{voteIndex + 1}.</td>
              {columns.map((c) => (
                <td className="text-center" key={c}>
                  {vote[c]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
