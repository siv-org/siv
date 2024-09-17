import { NumAcceptedVotes } from 'api/election/[election_id]/num-votes'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { CipherStrings } from 'src/crypto/stringify-shuffle'
import { EncryptedVote } from 'src/protocol/EncryptedVote'
import { useTruncatedTable } from 'src/trustee/decrypt/useTruncatedTable'
import { generateColumnNames } from 'src/vote/generateColumnNames'

import { Item } from '../vote/storeElectionInfo'
import { TotalVotesCast } from './TotalVotesCast'
import { useSWRExponentialBackoff } from './useSWRExponentialBackoff'

export type EncryptedVote = { auth: string } & { [index: string]: CipherStrings }
const fetcher = (url: string) => fetch(url).then((r) => r.json())

export const AcceptedVotes = ({
  allow_truncation = false,
  ballot_design,
  esignature_requested,
  has_decrypted_votes,
  title_prefix = '',
}: {
  allow_truncation?: boolean
  ballot_design?: Item[]
  esignature_requested?: boolean
  has_decrypted_votes?: boolean
  title_prefix?: string
}): JSX.Element => {
  const { election_id } = useRouter().query
  const [votes, setVotes] = useState<EncryptedVote[]>()

  // Exponentially poll for num votes (just a single read)
  const { data } = useSWRExponentialBackoff(
    !election_id ? null : `/api/election/${election_id}/num-votes`,
    fetcher,
    1,
  ) as { data: NumAcceptedVotes }
  const { num_invalidated_votes = 0, num_pending_votes = 0, num_votes = 0 } = data || {}

  // Load all the encrypted votes (heavy, so only on first load)
  useEffect(() => {
    if (!election_id) return
    fetch(`/api/election/${election_id}/accepted-votes`)
      .then((r) => r.json())
      .then(setVotes)
  }, [election_id])

  const { columns } = generateColumnNames({ ballot_design })
  const { TruncationToggle, rows_to_show } = useTruncatedTable({
    num_cols: columns.length,
    num_rows: num_votes,
  })

  if (!votes || !ballot_design) return <div>Loading...</div>

  const newTotalVotes = num_votes - votes.length - num_invalidated_votes

  return (
    <>
      <TotalVotesCast numVotes={num_votes} />
      <section className="p-4 mb-8 bg-white rounded-lg shadow-[0px_2px_2px_hsl(0_0%_50%_/0.333),0px_4px_4px_hsl(0_0%_50%_/0.333),0px_6px_6px_hsl(0_0%_50%_/0.333)]">
        <h3 className="mt-0 mb-1">{title_prefix}All Submitted Votes</h3>
        <p className='mt-0 text-sm italic opacity-70"'>
          Ordered oldest to newest.{' '}
          {has_decrypted_votes ? (
            <>
              These are the encrypted votes submitted by each authenticated voter.
              <br />
              For more, see{' '}
              <a className="font-semibold" href="../protocol#3" target="_blank">
                SIV Protocol Step 3: Submit Encrypted Vote
              </a>
              .
            </>
          ) : (
            `When the election closes, ${esignature_requested ? 'all approved' : 'these'} votes will
        be shuffled and then unlocked.`
          )}
        </p>
        <table className="block pb-2.5 mt-8 overflow-auto border-collapse [&_tr>*]:[border:1px_solid_#ccc] [&_tr>*]:px-2.5 [&_tr>*]:py-[3px] [&_tr>*]:max-w-[227px]">
          <thead className="text-[11px]">
            <tr>
              <td rowSpan={2}></td>
              {esignature_requested && <th rowSpan={2}>signature approved</th>}
              <th rowSpan={2}>auth</th>
              {columns.map((c) => (
                <th colSpan={2} key={c}>
                  {c}
                </th>
              ))}
            </tr>

            <tr>
              {columns.map((c) => (
                <Fragment key={c}>
                  <th>encrypted</th>
                  <th>lock</th>
                </Fragment>
              ))}
            </tr>
          </thead>

          <tbody>
            {votes.slice(0, allow_truncation ? rows_to_show : num_votes).map((vote, index) => (
              <tr key={index}>
                <td>{index + 1}.</td>
                {esignature_requested && (
                  <td className="font-bold text-center">{vote.signature_approved ? '✓' : ''}</td>
                )}
                <td className={`${vote.auth === 'pending' && 'italic opacity-50 text-xs'}`}>{vote.auth}</td>
                {columns.map((key) => {
                  if (key !== 'auth') {
                    return (
                      <Fragment key={key}>
                        <td className="font-mono text-[10px]">{vote[key]?.encrypted}</td>
                        <td className="font-mono text-[10px]">{vote[key]?.lock}</td>
                      </Fragment>
                    )
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {allow_truncation && <TruncationToggle />}

        {/* Load new votes */}
        {!!newTotalVotes && (
          <p
            className="inline-block mt-1.5 text-xs text-blue-500 cursor-pointer opacity-70 hover:underline"
            onClick={() => {
              const num_loaded_pending_votes = votes.filter(({ auth }) => auth === 'pending').length
              const num_new_pending_votes = num_pending_votes - num_loaded_pending_votes
              const num_new_accepted_votes = newTotalVotes - num_new_pending_votes

              fetch(
                `/api/election/${election_id}/accepted-votes?num_new_pending_votes=${num_new_pending_votes}&num_new_accepted_votes=${num_new_accepted_votes}`,
              )
                .then((r) => r.json())
                .then((newVotes) => {
                  if (!newVotes.length) window.location.reload()
                  setVotes(() => [...votes, ...newVotes])
                })
            }}
          >
            + Load {newTotalVotes} new
          </p>
        )}
      </section>
    </>
  )
}
