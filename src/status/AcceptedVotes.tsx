import { useRouter } from 'next/router'
import Pusher from 'pusher-js'
import { Fragment, useEffect, useState } from 'react'

import { Cipher_Text } from '../crypto/types'

type Vote = { auth: string } & { [index: string]: Cipher_Text }

export const AcceptedVotes = (): JSX.Element => {
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

  if (!votes) return <div>Loading...</div>

  const columns = Object.keys(votes[0]).filter((c) => c !== 'auth')

  return (
    <div>
      <h3>All Accepted Votes</h3>
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
              {Object.keys(vote).map((key) => {
                if (key !== 'auth') {
                  return (
                    <Fragment key={key}>
                      <td>{vote[key].encrypted}</td>
                      <td>{vote[key].unlock}</td>
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
          border: 1px solid #ddd;
        }

        th,
        td {
          border: 1px solid #ddd;
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
