import { countBy, mapValues, orderBy } from 'lodash-es'
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

  // Tally vote totals
  const vote_counts = countBy(data.map((v: { best_icecream: string }) => v.best_icecream))
  const tuples = mapValues(vote_counts, (votes, name) => ({ name, votes }))
  const ordered = orderBy(tuples, 'votes', 'desc')

  return (
    <div>
      <h3>Decrypted Votes</h3>
      <ol>
        {data.map((vote: NodeJS.Dict<string>, index: number) => (
          <li key={index}>{JSON.stringify(vote)}</li>
        ))}
      </ol>
      <br />
      <b>Final results:</b>
      <ol>
        {ordered.map(({ name, votes }) => (
          <li key={name}>
            {name}: {votes}
          </li>
        ))}
      </ol>
    </div>
  )
}
