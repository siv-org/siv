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

  if (!isOffline) return null

  return (
    <div className="px-3 py-2 mt-3 rounded-lg shadow-lg bg-yellow-200/50">
      <h3 className="mt-0">It appears you are now offline.</h3>
      <div>
        You can submit your vote via an air-gapped submission. If you do this from a Private Incognito window, it
        ensures even this webapp cannot possibly extract your private vote selections.
      </div>
      <h4>When you{"'"}re done making your vote selections...</h4>
      <div>
        1. Copy and Paste the following <i>Detailed Encryption Receipt</i> somewhere safe for your own private records:
      </div>
      <div className="mt-2 bg-gray-100">
        <DetailedEncryptionReceipt {...{ auth, election_id, state }} />
      </div>
    </div>
  )
}
