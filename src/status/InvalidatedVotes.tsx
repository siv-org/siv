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
        {votes.length} vote{votes.length > 1 ? 's were' : ' was'} invalidated by the election administrator.{' '}
        <a className="text-xs cursor-pointer" onClick={() => setTableVisibility(!isTableVisible)}>
          {isTableVisible ? 'Hide' : 'Show'}
        </a>
      </p>

      {isTableVisible && (
        <>
          <div className="text-xs text-gray-400">Auth Tokens:</div>
          <table>
            <tbody>
              {votes.map((vote, index) => (
                <tr key={index}>
                  <td>{index + 1}.</td>
                  <td className="">{vote.auth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  )
}
