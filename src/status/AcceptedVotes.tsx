import ms from 'ms'
import { useRouter } from 'next/router'
import useSWR from 'swr'

import { Cipher_Text } from '../crypto/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type Vote = { auth: string } & { [index: string]: Cipher_Text }

export const AcceptedVotes = (): JSX.Element => {
  const { election_id } = useRouter().query

  // Grab votes from api
  const { data, error } = useSWR(election_id ? `/api/election/${election_id}/accepted-votes` : null, fetcher, {
    refreshInterval: ms('10s'),
  })

  if (error) return <div>Error loading Accepted Votes</div>
  if (!data) return <div>Loading...</div>

  return (
    <div>
      <h3>Accepted Votes</h3>
      <ol>
        {data.map((vote: Vote, index: number) => (
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
      key === 'auth' ? '' : ` , ${key}: { encrypted: '${vote[key].encrypted}', unlock: '${vote[key].unlock}' }`,
    )
    .join('')} }`
