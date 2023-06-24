import { flatten } from 'lodash-es'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { CipherStrings } from 'src/crypto/stringify-shuffle'
import { EncryptedVote } from 'src/protocol/EncryptedVote'

import { Item } from '../vote/storeElectionInfo'
import { TotalVotesCast } from './TotalVotesCast'
import { useSWRExponentialBackoff } from './useSWRExponentialBackoff'

export type EncryptedVote = { auth: string } & { [index: string]: CipherStrings }
const fetcher = (url: string) => fetch(url).then((r) => r.json())

export const AcceptedVotes = ({
  ballot_design,
  esignature_requested,
  has_decrypted_votes,
  title_prefix = '',
}: {
  ballot_design?: Item[]
  esignature_requested?: boolean
  has_decrypted_votes?: boolean
  title_prefix?: string
}): JSX.Element => {
  const { election_id } = useRouter().query
  const [votes, setVotes] = useState<EncryptedVote[]>()

  // Exponentially poll for num votes (just a single read)
  const { data: numVotes } = useSWRExponentialBackoff(
    !election_id ? null : `/api/election/${election_id}/num-accepted-votes`,
    fetcher,
    1,
  ) as { data: number }

  // Load all the encrypted votes (heavy, so only on first load)
  useEffect(() => {
    if (!election_id) return
    fetch(`/api/election/${election_id}/accepted-votes`)
      .then((r) => r.json())
      .then(setVotes)
  }, [election_id])

  if (!votes || !ballot_design) return <div>Loading...</div>

  const newVotes = numVotes - votes.length

  const columns = flatten(
    ballot_design.map(({ id, multiple_votes_allowed }) => {
      return multiple_votes_allowed
        ? new Array(multiple_votes_allowed).fill('').map((_, index) => `${id || 'vote'}_${index + 1}`)
        : id || 'vote'
    }),
  )

  return (
    <>
      <TotalVotesCast {...{ numVotes }} />
      <section className="p-4 mb-8 bg-white rounded-lg shadow-[0px_2px_2px_hsl(0_0%_50%_/0.333),0px_4px_4px_hsl(0_0%_50%_/0.333),0px_6px_6px_hsl(0_0%_50%_/0.333)]">
        <h3 className="mt-0 mb-1">{title_prefix}All Submitted Votes</h3>
        <p className='mt-0 text-sm italic opacity-70"'>
          Ordered oldest to newest.{' '}
          {has_decrypted_votes ? (
            <>
              These are the encrypted votes submitted by each authenticated voter.
              <br />
              For more, see{' '}
              <a href="../protocol#3" target="_blank">
                SIV Protocol Step 3: Submit Encrypted Vote
              </a>
              .
            </>
          ) : (
            `When the election closes, ${esignature_requested ? 'all approved' : 'these'} votes will
        be shuffled and then unlocked.`
          )}
        </p>
        <table>
          <thead>
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

            <tr className="subheading">
              {columns.map((c) => (
                <Fragment key={c}>
                  <th>encrypted</th>
                  <th>lock</th>
                </Fragment>
              ))}
            </tr>
          </thead>

          <tbody>
            {votes.map((vote, index) => (
              <tr key={index}>
                <td>{index + 1}.</td>
                {esignature_requested && (
                  <td className="font-bold text-center">{vote.signature_approved ? '✓' : ''}</td>
                )}
                <td>{vote.auth}</td>
                {columns.map((key) => {
                  if (key !== 'auth') {
                    return (
                      <Fragment key={key}>
                        <td className="monospaced">{vote[key]?.encrypted}</td>
                        <td className="monospaced">{vote[key]?.lock}</td>
                      </Fragment>
                    )
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {!!newVotes && (
          <p
            className="inline-block mt-3 text-xs text-blue-500 cursor-pointer opacity-70 hover:underline"
            onClick={() =>
              fetch(`/api/election/${election_id}/accepted-votes?limitToLast=${newVotes}`)
                .then((r) => r.json())
                .then((newVotes) => setVotes(() => [...votes, ...newVotes]))
            }
          >
            + Load {newVotes} new
          </p>
        )}

        <style jsx>{`
          a {
            font-weight: 600;
          }

          table {
            border-collapse: collapse;
            display: block;
            overflow: auto;
            margin-top: 2rem;
          }

          th,
          td {
            border: 1px solid #ccc;
            padding: 3px 10px;
            margin: 0;
            max-width: 240px;
          }

          td.monospaced {
            font-family: monospace;
          }

          th,
          .subheading td {
            font-size: 11px;
            font-weight: 700;
          }
        `}</style>
      </section>
    </>
  )
}

export const stringifyEncryptedVote = (vote: EncryptedVote) =>
  `{ auth: ${vote.auth}${Object.keys(vote)
    .map((key) =>
      key === 'auth' ? '' : `, ${key}: { encrypted: '${vote[key].encrypted}', lock: '${vote[key].lock}' }`,
    )
    .join('')} }`
