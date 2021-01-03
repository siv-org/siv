import { useRouter } from 'next/router'
import Pusher from 'pusher-js'
import { useEffect, useState } from 'react'

import { Totals } from './Totals'

export const DecryptedVotes = (): JSX.Element => {
  const { election_id } = useRouter().query
  const [votes, setVotes] = useState<[]>()

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

  return (
    <div>
      <Totals {...{ votes }} />
      <br />
      <h3>Decrypted Votes</h3>
      <p>Order has been randomized.</p>
      <ol>
        {votes.map((vote: NodeJS.Dict<string>, index: number) => (
          <li key={index}>
            tracking: {vote.tracking}
            {Object.keys(vote).map((key) => {
              if (key !== 'tracking') return `, ${key}: ${vote[key]}`
            })}
          </li>
        ))}
      </ol>
      <style jsx>{`
        h3 {
          margin-bottom: 5px;
        }

        p {
          margin-top: 0px;
          font-size: 13px;
          font-style: italic;
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
