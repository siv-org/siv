import Link from 'next/link'

import { useStored } from '../useStored'

export const PrivacyProtectorsWarning = () => {
  const { election_id, trustees } = useStored()
  if (!trustees || trustees.length < 2) return null

  return (
    <div>
      <details className="px-4 py-2 border-2 border-orange-200 border-solid rounded-lg group">
        <summary className="py-2 cursor-pointer">
          <span className="opacity-50">Reminder:</span> Unlocking will need each Privacy Protector&apos;s device.
          <span className="ml-2 text-xs opacity-50">
            <span className="group-open:hidden">more</span>
            <span className="hidden group-open:inline">less</span>
          </span>
        </summary>
        <div className="space-y-1">
          <div>
            Unlocking votes needs each Privacy Protector&apos;s decryption key, stored on their original device and
            browser.
          </div>
          <div>✅ Make sure they still have access.</div>
          <div>🚫 If not, you can create a new election.</div>
          <div>
            <Link href={`/admin/${election_id}/privacy`}>
              <a>Review Privacy Protectors</a>
            </Link>
          </div>
        </div>
      </details>
    </div>
  )
}
