import ms from 'ms'
import { useRouter } from 'next/router'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export const DecryptedVotes = (): JSX.Element => {
  const { election_id } = useRouter().query

  // Grab votes from api
  const { data } = useSWR(election_id ? `/api/election/${election_id}/decrypted-votes` : null, fetcher, {
    refreshInterval: ms('10s'),
  })

  if (!data) return <></>

  return (
    <div>
      <h3>Decrypted Votes</h3>
      <ol>
        {data.map((vote: NodeJS.Dict<string>, index: number) => (
          <li key={index}>{JSON.stringify(vote)}</li>
        ))}
      </ol>
    </div>
  )
}
