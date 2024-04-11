import Link from 'next/link'
import TimeAgo from 'timeago-react'

import { useConventionInfo } from './useConventionInfo'

export const ListOfVoterSets = () => {
  const { voters } = useConventionInfo()

  return (
    <ol className="inset-0 pl-6 mt-0 ml-0">
      {voters?.map(({ createdAt, number }, i) => (
        <li key={i}>
          {/* Size */}
          <span className="inline-block w-20">Set of {number} </span>

          {/* Download */}
          <Link href={`/admin/conventions/download?n=${number}`} target="_blank">
            <a className="pl-1" target="_blank">
              Download
            </a>
          </Link>

          {/* Time */}
          <span className="inline-block w-32 text-[13px] text-right opacity-60">
            {+new Date() - +new Date(createdAt._seconds * 1000) < 60 * 1000 ? (
              'Just now'
            ) : (
              <TimeAgo datetime={new Date(createdAt._seconds * 1000)} />
            )}{' '}
          </span>
        </li>
      ))}
    </ol>
  )
}
