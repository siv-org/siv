import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'

import { EncryptedVote, subscribeToUpdates } from './AcceptedVotes'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export const InvalidatedVotes = (): JSX.Element => {
  const { election_id } = useRouter().query
  const [isTableVisible, setTableVisibility] = useState(false)

  const { data: votes, mutate } = useSWR<EncryptedVote[]>(
    !election_id ? null : `/api/election/${election_id}/invalidated-votes`,
    fetcher,
  )

  // Subscribe to pusher updates of new votes
  subscribeToUpdates(mutate, election_id)

  if (!votes) return <div>Loading...</div>

  return (
    <section className="p-4 mb-8 bg-white rounded shadow-md">
      <h3 className="mb-1">Invalidated Votes</h3>
      <p className="text-sm italic opacity-70">
        These votes were invalidated by the election administrator.{' '}
        <button onClick={() => setTableVisibility(!isTableVisible)}>
          {isTableVisible ? 'Hide' : 'Show'} Invalidated Votes
        </button>
      </p>

      {isTableVisible && (
        <table>
          <thead>
            <tr>
              <th></th>
              <th className="py-2 text-left">Auth Token</th>
            </tr>
          </thead>
          <tbody>
            {votes.map((vote, index) => (
              <tr key={index}>
                <td>{index + 1}.</td>
                <td className="">{vote.auth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
