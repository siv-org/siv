import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { DetailedEncryptionReceipt } from './submitted/DetailedEncryptionReceipt'
import { State } from './vote-state'

export const AirGappedSubmission = ({
  auth,
  election_id,
  state,
}: {
  auth?: string
  election_id?: string
  state: State
}) => {
  const [isOffline, setIsOffline] = useState(false)
  const path = useRouter().asPath

  // Show when going offline
  useEffect(() => {
    const setOnline = () => setIsOffline(false)
    const setOffline = () => setIsOffline(true)

    window.addEventListener('online', setOnline)
    window.addEventListener('offline', setOffline)

    return () => {
      window.removeEventListener('online', setOnline)
      window.removeEventListener('offline', setOffline)
    }
  }, [])

  // Or include "offline" in path (e.g /vote?auth=foo&offline) to show even if online
  if (!(isOffline || path.includes('offline'))) return null

  const submission_url = `/api/submit-vote?auth=${auth}&election_id=${election_id}&encrypted_vote=${JSON.stringify(
    sortedKeys(state.encrypted),
  )}`

  return (
    <div className="px-3 py-2 mt-3 rounded-lg shadow-lg bg-yellow-200/50">
      <h3 className="mt-0">It appears you are now offline.</h3>

      <div>
        You can submit your vote via an air-gapped submission. If you do this from a Private Incognito window, it
        ensures even this webapp cannot possibly extract your private vote selections.
      </div>
      <h4>1. When you{"'"}re done making your vote selections...</h4>

      <div>
        Copy and Paste the following <i>Detailed Encryption Receipt</i> somewhere safe for your own private records:
        <div className="mt-2 bg-gray-100">
          <DetailedEncryptionReceipt {...{ auth, election_id, state }} />
        </div>
      </div>

      <div>
        <h4 className="mt-16 mb-3">2. Verifying your Vote</h4>
        The easiest way to quickly verify your vote was counted correctly is your <i>Verification #</i>.
        <div className="mb-3 opacity-60">
          This unique secret number is generated randomly on your own device. No one else can know it.
        </div>
        <div className="opacity-60">When the election closes, all anonymized votes will published.</div>
        <div className="font-semibold opacity-80">
          Find yours again with your <i>Verification #</i>:
        </div>
        <div className="inline-block px-1 mt-1 text-lg font-bold border-2 border-green-700 border-solid rounded bg-green-300/50">
          {state.tracking}
        </div>
        <div className="mt-2 opacity-50">
          It is included in your <i>Detailed Encryption Receipt</i> above, but you may wish to note it down separately
          for quicker access.
        </div>
      </div>

      <div>
        <h4 className="mt-16 mb-3">3. Submitting your Vote</h4>
        Lastly, now that your private verification information is backed up, you are ready to submit your encrypted
        vote.
        <div className="mt-2 opacity-50">Your full encrypted vote is:</div>
        <div className="px-2 py-1 mb-3 overflow-x-scroll text-xs whitespace-pre bg-gray-100 rounded shadow-lg">
          {JSON.stringify(sortedKeys(state.encrypted), null, 2)}
        </div>
        <div>
          You can submit this encrypted payload by visiting this <i className="font-semibold">Submission URL</i>, once
          you turn your internet back on:
        </div>
        <div>
          <a className="text-xs break-all" href={submission_url} rel="noreferrer" target="_blank">
            {window.location.origin}
            {submission_url}
          </a>
        </div>
        <hr className="my-5 opacity-30" />
        <div className="my-2">
          Once you{"'"}ve copied down your private data and Submission URL, you can close this window, turn your
          internet back on, and visit your submission URL.
        </div>
      </div>
    </div>
  )
}

function sortedKeys(obj: unknown): string {
  const sortedObj = JSON.parse(
    JSON.stringify(obj, (key, value) =>
      value instanceof Object && !(value instanceof Array)
        ? Object.keys(value)
            .sort()
            .reduce((sorted, key) => {
              sorted[key] = value[key]
              return sorted
            }, {} as Record<string, unknown>)
        : value,
    ),
  )
  return sortedObj
}
