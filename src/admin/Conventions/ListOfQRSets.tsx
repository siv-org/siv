import Link from 'next/link'
import TimeAgo from 'timeago-react'

import { useConventionInfo } from './useConventionInfo'

export const ListOfQRSets = () => {
  const { id, qrs } = useConventionInfo()

  return (
    <ol className="inset-0 pl-6 mt-0 ml-0">
      {qrs?.map(({ createdAt, number }, i) => (
        <li key={i}>
          {/* Size */}
          <span className="inline-block w-20">Set of {number} </span>

          {/* Download */}
          <Link className="pl-1" href={`/admin/conventions/download?c=${id}&set=${i}`} target="_blank">
            Download
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
