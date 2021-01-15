import { useRouter } from 'next/router'
import Pusher from 'pusher-js'
import { Fragment, useEffect, useState } from 'react'

import { Cipher_Text } from '../crypto/types'
import { Item } from '../vote/useElectionInfo'

type Vote = { auth: string } & { [index: string]: Cipher_Text }

export const AcceptedVotes = ({
  ballot_design,
  title_prefix = '',
}: {
  ballot_design?: Item[]
  title_prefix: string
}): JSX.Element => {
  const { election_id } = useRouter().query

  const [votes, setVotes] = useState<Vote[]>()

  const loadVotes = () =>
    election_id &&
    fetch(`/api/election/${election_id}/accepted-votes`)
      .then((res) => res.json())
      .then(setVotes)

  // Load votes when election_id is first set
  useEffect(() => {
    loadVotes()
  }, [election_id])

  // Subscribe to pusher updates of new votes
  subscribeToUpdates(loadVotes, election_id)

  if (!votes || !ballot_design) return <div>Loading...</div>

  const columns = ballot_design.map((i) => i.id || 'vote')

  return (
    <div>
      <h3>{title_prefix}All Accepted Votes</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>auth</th>
            {columns.map((c) => (
              <th colSpan={2} key={c}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Column subheadings */}
          <tr className="subheading">
            <td></td>
            <td></td>
            {columns.map((c) => (
              <Fragment key={c}>
                <td>encrypted</td>
                <td>unlock</td>
              </Fragment>
            ))}
          </tr>
          {votes.map((vote, index) => (
            <tr key={index}>
              <td>{index + 1}.</td>
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
        </tbody>
      </table>
      <style jsx>{`
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
      `}</style>
    </div>
  )
}

export const stringifyEncryptedVote = (vote: Vote) =>
  `{ auth: ${vote.auth}${Object.keys(vote)
    .map((key) =>
      key === 'auth' ? '' : `, ${key}: { encrypted: '${vote[key].encrypted}', unlock: '${vote[key].unlock}' }`,
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
