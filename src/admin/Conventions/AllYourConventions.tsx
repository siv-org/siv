import { Convention } from 'api/conventions/list-all-conventions'
import Link from 'next/link'
import { useReducer } from 'react'
import useSWR from 'swr'
import TimeAgo from 'timeago-react'

export const AllYourConventions = () => {
  const [show, toggle] = useReducer((state) => !state, true)

  const { data } = useSWR('/api/conventions/list-all-conventions', (url: string) =>
    fetch(url).then(async (r) => {
      if (!r.ok) throw await r.json()
      return await r.json()
    }),
  )

  return (
    <>
      <h2>
        Your Conventions: <span className="font-normal">{data?.conventions?.length}</span>{' '}
        {!!data?.conventions?.length && (
          <a className="text-[14px] font-normal ml-1 cursor-pointer" onClick={toggle}>
            [ {show ? '- Hide' : '+ Show'} ]
          </a>
        )}
      </h2>
      {show && (
        <ul>
          {data?.conventions?.map(({ convention_title, created_at, id }: Convention) => (
            <li key={id}>
              <Link href={`/admin/conventions/${id}`}>
                <TimeAgo datetime={new Date(created_at._seconds * 1000)} />: {convention_title}
              </Link>
            </li>
          ))}
          <br />
        </ul>
      )}
    </>
  )
}
