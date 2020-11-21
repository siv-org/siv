import ms from 'ms'
import { useRouter } from 'next/router'
import useSWR from 'swr'

import { Tally } from './Tally'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export const DecryptedVotes = (): JSX.Element => {
  const { election_id } = useRouter().query

  // Grab votes from api
  const { data: votes } = useSWR(election_id ? `/api/election/${election_id}/decrypted-votes` : null, fetcher, {
    refreshInterval: ms('10s'),
  })

  if (!votes) return <></>

  return (
    <div>
      <h3>Decrypted Votes</h3>
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
      <br />
      <Tally {...{ votes }} />
    </div>
  )
}
