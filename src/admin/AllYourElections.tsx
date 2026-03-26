import { Election } from 'api/admin-all-elections'
import Link from 'next/link'
import { useReducer } from 'react'
import useSWR from 'swr'
import TimeAgo from 'timeago-react'

export const fetcher = (url: string) =>
  fetch(url).then(async (resp) => {
    if (!resp.ok) throw await resp.json()
    return await resp.json()
  })

export const useAllYourElections = () => useSWR('/api/admin-all-elections', fetcher)

export const AllYourElections = () => {
  const [show, toggle] = useReducer((state) => !state, false)

  // Load the aggregated count on first render
  const { election_count } = useSWR('/api/admin-elections-count', fetcher).data || {}

  // Only start fetching the full list after clicking "Show"
  const { data: { elections } = {}, isLoading: listLoading } = useSWR(show ? '/api/admin-all-elections' : null, fetcher)

  return (
    <>
      <h2>
        Your Ballots: <span className="font-normal">{election_count}</span>{' '}
        {!!election_count && (
          <a className="text-[14px] font-normal ml-1 cursor-pointer" onClick={toggle}>
            [ {show ? '- Hide' : '+ Show'} ]
          </a>
        )}
      </h2>

      {show && (
        <ul>
          {listLoading && <div className="animate-pulse">Loading…</div>}
          {elections?.map(({ created_at, election_title, id }: Election) => (
            <li key={id}>
              <Link href={`/admin/${id}/voters`}>
                <TimeAgo datetime={new Date(created_at._seconds * 1000)} />: {election_title}
              </Link>
            </li>
          ))}
          <br />
        </ul>
      )}
    </>
  )
}
