import { useEffect, useState } from 'react'
import { Spinner } from 'src/admin/Spinner'
import { api } from 'src/api-helper'

export const CallerIDCheck = ({ link_auth, number }: { link_auth: string; number: string }) => {
  const [results, setResults] = useState<null | { callerName: { caller_name: string } }>(null)
  const callerName = results?.callerName?.caller_name

  useEffect(() => {
    const checkCallerID = async () => {
      const results = await api('11-chooses/provisional/get-callerid', { link_auth, lookupNum: number })
      if (!results.ok) {
        console.error('lookup response', results, await results.json())
        return
      }
      const json = await results.json()
      console.log('lookup results', json.results)
      setResults(json.results)
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
      ) : !callerName ? (
        <>
          ❌ No caller ID found.
          <br />
          Sorry, please try another method.
        </>
      ) : (
        <>Caller ID: {callerName}</>
      )}
    </div>
  )
}
