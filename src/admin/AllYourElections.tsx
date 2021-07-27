import Link from 'next/link'
import { useRouter } from 'next/router'
import { useReducer } from 'react'
import useSWR from 'swr'
import TimeAgo from 'timeago-react'

import { Election } from '../../pages/api/admin-all-elections'

export const AllYourElections = () => {
  const [show, toggle] = useReducer((state) => !state, false)

  const { data } = useSWR('/api/admin-all-elections', (url: string) =>
    fetch(url).then(async (r) => {
      if (!r.ok) throw await r.json()
      return await r.json()
    }),
  )

  if (useRouter().query.election_id) return <></>

  return (
    <>
      <h2>
        Your Existing Elections: <i>{data?.elections?.length}</i>{' '}
        <span>
          <a onClick={toggle}>[ {show ? '- Hide' : '+ Show'} ]</a>
        </span>
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

      <style jsx>{`
        h2 i {
          font-weight: 400;
          font-style: normal;
        }

        h2 span {
          font-size: 14px;
          font-weight: normal;
          margin-left: 5px;
        }

        h2 span:hover {
          cursor: pointer;
        }
      `}</style>
    </>
  )
}
