import { useRouter } from 'next/router'
import Pusher from 'pusher-js'
import { useEffect, useState } from 'react'

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

  return (
    <div>
      <h3>All Accepted Votes</h3>
      <ol>
        {votes.map((vote: Vote, index: number) => (
          <li key={index}>{stringifyEncryptedVote(vote)}</li>
        ))}
      </ol>
      <style jsx>{`
        li {
          white-space: pre-wrap;
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
