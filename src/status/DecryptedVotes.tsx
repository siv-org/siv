import { useRouter } from 'next/router'
import Pusher from 'pusher-js'
import { useEffect, useState } from 'react'

import { Item } from '../vote/useElectionInfo'
import { Totals } from './Totals'

export const DecryptedVotes = ({ ballot_design }: { ballot_design?: Item[] }): JSX.Element => {
  const { election_id } = useRouter().query
  const [votes, setVotes] = useState<Record<string, string>[]>()
  const [last_decrypted_at, set_last_decrypted_at] = useState<Date>()

  const loadVotes = () =>
    election_id &&
    Promise.all([
      fetch(`/api/election/${election_id}/decrypted-votes`)
        .then((res) => res.json())
        .then(setVotes),
      fetch(`/api/election/${election_id}/info`)
        .then((res) => res.json())
        .then(
          ({ last_decrypted_at }) =>
            last_decrypted_at && set_last_decrypted_at(new Date(last_decrypted_at._seconds * 1000)),
        ),
    ])

  // Load votes when election_id is first set
  useEffect(() => {
    loadVotes()
  }, [election_id])

  // Subscribe to pusher updates of new votes
  subscribeToUpdates(loadVotes, election_id)

  if (!votes || !votes.length || !ballot_design) return <></>

  return (
    <div>
      <Totals {...{ ballot_design, last_decrypted_at, votes }} />
      <br />
      <h3>Decrypted Votes</h3>
      <p>Order has been randomized.</p>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>tracking #</th>
            {ballot_design.map(({ id = 'vote' }) => (
              <th key={id}>{id}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {votes.map((vote, index) => (
            <tr key={index}>
              <td>{index + 1}.</td>
              <td>{vote.tracking?.padStart(14, '0')}</td>
              {ballot_design.map(({ id = 'vote' }) => (
                <td key={id}>{vote[id]}</td>
              ))}
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
