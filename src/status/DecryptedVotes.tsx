import { orderBy } from 'lodash-es'
import { Tooltip } from 'src/admin/Voters/Tooltip'
import { generateColumnNames } from 'src/vote/generateColumnNames'
import { Item } from 'src/vote/storeElectionInfo'

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
          <h3 className="mt-0 mb-1.5">Decrypted Votes</h3>
          <p className="mt-0 text-[13px] italic opacity-70">Anonymized for vote secrecy.</p>
        </>
      )}
      <table className="block overflow-auto border-collapse [&_tr>*]:[border:1px_solid_#ccc] [&_tr>*]:px-2.5 [&_tr>*]:py-[3px]">
        <thead>
          <tr className="text-[11px]">
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
                  {isTypeBudget(ballot_design, c) ? validate(vote[c]) : unTruncateSelection(vote[c], ballot_design, c)}

                  {/* Fix centering for negative Scores */}
                  {vote[c]?.match(/^-\d$/) && <span className="inline-block w-1.5" />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function isTypeBudget(ballot_design: Item[], col: string) {
  // Check for matching ballot types = 'budget'
  const possibleItem = ballot_design.find(({ id = 'vote', type }) => type === 'budget' && col.startsWith(id))
  if (!possibleItem) return false

  // If found, check if col is in options
  const matchingCol = possibleItem.options.find(({ name, value }) => col.endsWith(value || name))

  return !!matchingCol
}

function validate(vote: string) {
  if (!vote) return vote
  const errorStyling = `text-red-500 border-0 border-b border-red-500 border-dashed opacity-70`
  let error: string = ''
  if (Number(vote) < 0) error = 'Negative amounts not allowed'
  if (Number.isNaN(Number(vote))) error = 'Not a number'
  if (Number(vote) === Infinity) error = "Can't normalize Infinity"

  if (error)
    return (
      <Tooltip tooltip={error}>
        <span className={errorStyling}>{vote}</span>
      </Tooltip>
    )

  return '$' + vote
}
