import ms from 'ms'
import { useRouter } from 'next/router'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

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
        {data.map((vote: NodeJS.Dict<string>, index: number) => (
          <li key={index}>{JSON.stringify(vote)}</li>
        ))}
      </ol>
    </div>
  )
}
