import { useEffect, useState } from 'react'
import { Spinner } from 'src/admin/Spinner'
import { api } from 'src/api-helper'

import { revalidateAuthComplete } from '../ProvisionalAuthComplete'

export const CallerIDCheck = ({
  election_id,
  link_auth,
  number,
}: {
  election_id: string
  link_auth: string
  number: string
}) => {
  const [results, setResults] = useState<null | { callerID: string; match: boolean }>(null)
  const { callerID, match } = results ?? {}

  useEffect(() => {
    const checkCallerID = async () => {
      const results = await api('11-chooses/provisional/get-callerid', { election_id, link_auth, lookupNum: number })
      if (!results.ok) {
        console.error('lookup response', results, await results.json())
        return
      }
      const json = await results.json()
      // console.log('lookup results', json)
      setResults(json)

      if (json?.match) revalidateAuthComplete(election_id, link_auth)
    }
    checkCallerID()
  }, [number])

  return (
    <div className="pr-4 mt-4 text-sm text-black/70">
      {!results ? (
        <div className="animate-pulse">
          <span className="relative bottom-0.5">
            <Spinner />
          </span>{' '}
          Checking caller ID...
        </div>
      ) : !match ? (
        <>
          {!callerID ? '❌ No caller ID found.' : '❌ CallerID not a match.'}
          <br />
          Sorry, please try another method.
        </>
      ) : (
        <>Caller ID: {callerID}</>
      )}
    </div>
  )
}
