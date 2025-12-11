import { useState } from 'react'

export const ElectionNotice = ({ election_id }: { election_id: string }) => {
  const [showNoticeMessage, setShowNoticeMessage] = useState(true)

  if (!showNoticeMessage) return null
  if (!warningFor11c.includes(election_id)) return null

  return (
    <div className="mt-3 mb-3">
      <div className="flex items-start px-4 py-3 text-sm text-yellow-900 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm">
        <p className="leading-relaxed">
          <span className="font-semibold">⚠️ Important:</span> Due to a printing & mailing error, households with 4 or
          more voters didn&apos;t receive all their Voter Code invitations.
          <br />
          All registered voters can still cast a Provisional Ballot at{' '}
          <a
            className="font-medium underline text-blue-500/80"
            href="https://11.siv.org/vote"
            rel="noreferrer"
            target="_blank"
          >
            11.siv.org/vote
          </a>
          .
        </p>
        <button
          aria-label="Dismiss important notice"
          className="ml-3 text-lg leading-none text-yellow-700 cursor-pointer hover:text-yellow-900 hover:shadow-lg"
          onClick={() => setShowNoticeMessage(false)}
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  )
}

const a11cTest3 = '1765426466660'
const live11c = '1764187291234'
const warningFor11c = [a11cTest3, live11c]
