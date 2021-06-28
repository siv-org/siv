import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import TimeAgo from 'timeago-react'

import { Election } from '../../pages/api/admin-all-elections'

export const AllYourElections = () => {
  const { data } = useSWR('api/admin-all-elections', (url: string) =>
    fetch(url).then(async (r) => {
      if (!r.ok) throw await r.json()
      return await r.json()
    }),
  )

  if (useRouter().query.election_id) return <></>

  return (
    <>
      <h2>Your Existing Elections</h2>
      <ul>
        {data?.elections?.map(({ created_at, election_title, id }: Election) => (
          <li key={id}>
            <Link href={`?election_id=${id}`}>
              <a>
                <TimeAgo datetime={new Date(created_at._seconds * 1000)} />: {election_title}
              </a>
            </Link>
          </li>
        ))}
      </ul>
      <br />
    </>
  )
}
