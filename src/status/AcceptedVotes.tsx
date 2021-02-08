import { flatten } from 'lodash-es'
import { useRouter } from 'next/router'
import Pusher from 'pusher-js'
import { Fragment, useEffect } from 'react'
import useSWR from 'swr'

import { Cipher_Text } from '../crypto/types'
import { Item } from '../vote/useElectionInfo'

type Vote = { auth: string } & { [index: string]: Cipher_Text }
const fetcher = (url: string) => fetch(url).then((r) => r.json())

export const AcceptedVotes = ({
  ballot_design,
  esignature_requested,
  title_prefix = '',
}: {
  ballot_design?: Item[]
  esignature_requested?: boolean
  title_prefix?: string
}): JSX.Element => {
  const { election_id } = useRouter().query

  const { data: votes, mutate } = useSWR<Vote[]>(
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
    <div>
      <h3>{title_prefix}All Submitted Votes</h3>
      <p>
        Ordered oldest to newest. When the election closes, {esignature_requested ? 'all approved' : 'these'} votes will
        be shuffled and then unlocked.
      </p>
      <table>
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
                    <td>{vote[key]?.unlock}</td>
                  </Fragment>
                )
              }
            })}
          </tr>
        ))}
      </table>
      <style jsx>{`
        h3 {
          margin-bottom: 5px;
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
    </div>
  )
}

export const stringifyEncryptedVote = (vote: Vote) =>
  `{ auth: ${vote.auth}${Object.keys(vote)
    .map((key) =>
      key === 'auth' ? '' : `, ${key}: { encrypted: '${vote[key].encrypted}', lock: '${vote[key].unlock}' }`,
    )
    .join('')} }`

function subscribeToUpdates(loadVotes: () => void, election_id?: string | string[]) {
  function subscribe() {
    // Enable pusher logging - don't include this in production
    // Pusher.logToConsole = true

    const pusher = new Pusher('9718ba0612df1a49e52b', { cluster: 'us3' })

    const channel = pusher.subscribe(`create-${election_id}`)

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
