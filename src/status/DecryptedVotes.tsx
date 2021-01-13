import { useRouter } from 'next/router'
import Pusher from 'pusher-js'
import { useEffect, useState } from 'react'

import { Totals } from './Totals'

export const DecryptedVotes = (): JSX.Element => {
  const { election_id } = useRouter().query
  const [votes, setVotes] = useState<Record<string, string>[]>()

  const loadVotes = () =>
    election_id &&
    fetch(`/api/election/${election_id}/decrypted-votes`)
      .then((res) => res.json())
      .then(setVotes)

  // Load votes when election_id is first set
  useEffect(() => {
    loadVotes()
  }, [election_id])

  // Subscribe to pusher updates of new votes
  subscribeToUpdates(loadVotes, election_id)

  if (!votes || !votes.length) return <></>

  const columns = Object.keys(votes[0]).filter((c) => c !== 'tracking')

  return (
    <div>
      <Totals {...{ votes }} />
      <br />
      <h3>Decrypted Votes</h3>
      <p>Order has been randomized.</p>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>tracking #</th>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {votes.map((vote, index) => (
            <tr key={index}>
              <td>{index + 1}.</td>
              <td>{vote.tracking?.padStart(14, '0')}</td>
              {Object.keys(vote).map((key) => {
                if (key !== 'tracking') {
                  return <td key={key}>{vote[key]}</td>
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        h3 {
          margin-bottom: 5px;
        }

        p {
          margin-top: 0px;
          font-size: 13px;
          font-style: italic;
        }

        table {
          border-collapse: collapse;
        }

        th,
        td {
          border: 1px solid #bbb;
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

function subscribeToUpdates(loadVotes: () => void, election_id?: string | string[]) {
  function subscribe() {
    if (!election_id) return

    // Enable pusher logging - don't include this in production
    // Pusher.logToConsole = true

    const pusher = new Pusher('9718ba0612df1a49e52b', { cluster: 'us3' })

    const channel = pusher.subscribe(election_id as string)

    channel.bind(`decrypted`, () => {
      console.log('🆕 [Pusher] New decrypted votes')
      loadVotes()
    })

    // Return cleanup code
    return () => {
      channel.unbind()
    }
  }

  // Subscribe when we get election_id
  useEffect(subscribe, [election_id])
}
