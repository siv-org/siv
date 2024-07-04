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
        <div className="mt-2 bg-gray-100">
          <DetailedEncryptionReceipt {...{ auth, election_id, state }} />
        </div>
      </div>

      <div>
        <h4 className="mt-6 mb-3">Verifying your Vote</h4>
        2. The easiest way to quickly verify your vote was counted correctly is your <i>Verification #</i>.
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
    </div>
  )
}
