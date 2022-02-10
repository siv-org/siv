import { flatten } from 'lodash-es'
import { useRouter } from 'next/router'
import { Fragment, useEffect } from 'react'
import { CipherStrings } from 'src/crypto/stringify-shuffle'
import { pusher } from 'src/pusher-helper'
import useSWR from 'swr'

import { Item } from '../vote/storeElectionInfo'

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

  const { data: votes, mutate } = useSWR<EncryptedVote[]>(
    !election_id ? null : `/api/election/${election_id}/accepted-votes`,
    fetcher,
  )

  // Subscribe to pusher updates of new votes
  subscribeToUpdates(mutate, election_id)

  if (!votes || !ballot_design) return <div>Loading...</div>

  const columns = flatten(
    ballot_design.map(({ id, multiple_votes_allowed }) => {
      return multiple_votes_allowed
        ? new Array(multiple_votes_allowed).fill('').map((_, index) => `${id || 'vote'}_${index + 1}`)
        : id || 'vote'
    }),
  )

  return (
    <section>
      <h3>{title_prefix}All Submitted Votes</h3>
      <p>
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
              {esignature_requested && <td className="approved">{vote.signature_approved ? '✓' : ''}</td>}
              <td>{vote.auth}</td>
              {columns.map((key) => {
                if (key !== 'auth') {
                  return (
                    <Fragment key={key}>
                      <td>{vote[key]?.encrypted}</td>
                      <td>{vote[key]?.lock}</td>
                    </Fragment>
                  )
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        section {
          background: #fff;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0px 2px 2px hsl(0 0% 50% / 0.333), 0px 4px 4px hsl(0 0% 50% / 0.333),
            0px 6px 6px hsl(0 0% 50% / 0.333);

          margin-bottom: 2rem;
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

        a {
          font-weight: 600;
        }

        table {
          border-collapse: collapse;
          display: block;
          overflow: scroll;
          margin-top: 2rem;
        }

        th,
        td {
          border: 1px solid #ccc;
          padding: 3px 10px;
          margin: 0;
          max-width: 360px;
        }

        th,
        .subheading td {
          font-size: 11px;
          font-weight: 700;
        }

        .approved {
          font-weight: bold;
          text-align: center;
        }
      `}</style>
    </section>
  )
}

export const stringifyEncryptedVote = (vote: EncryptedVote) =>
  `{ auth: ${vote.auth}${Object.keys(vote)
    .map((key) =>
      key === 'auth' ? '' : `, ${key}: { encrypted: '${vote[key].encrypted}', lock: '${vote[key].lock}' }`,
    )
    .join('')} }`

function subscribeToUpdates(loadVotes: () => void, election_id?: string | string[]) {
  function subscribe() {
    if (!pusher) return alert('Pusher not initialized')

    const channel = pusher.subscribe(`status-${election_id}`)

    channel.bind(`votes`, () => {
      console.log('🆕 Pusher new vote submitted')
      loadVotes()
    })

    // Return cleanup code
    return () => {
      channel.unbind()
    }
  }

  // Subscribe when we get election_id
  useEffect(() => {
    if (election_id) {
      return subscribe()
    }
  }, [election_id])
}
