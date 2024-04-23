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

  const { data } = useAllYourElections()

  return (
    <>
      <h2>
        Your Elections: <span className="font-normal">{data?.elections?.length}</span>{' '}
        {!!data?.elections?.length && (
          <a className="text-[14px] font-normal ml-1 cursor-pointer" onClick={toggle}>
            [ {show ? '- Hide' : '+ Show'} ]
          </a>
        )}
      </h2>

      {show && (
        <ul>
          {data?.elections?.map(({ created_at, election_title, id }: Election) => (
            <li key={id}>
              <Link href={`/admin/${id}/voters`}>
                <a>
                  <TimeAgo datetime={new Date(created_at._seconds * 1000)} />: {election_title}
                </a>
              </Link>
            </li>
          ))}
          <br />
        </ul>
      )}
    </>
  )
}
