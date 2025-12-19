import Link from 'next/link'
import { useState } from 'react'
import { api } from 'src/api-helper'
import { useDecryptedVotes } from 'src/status/use-decrypted-votes'

import { Spinner } from '../Spinner'
import { revalidate, useStored } from '../useStored'
import { useIsUnlockBlocked } from './use-is-unlock-blocked'

export const UnlockedStatus = () => {
  const { election_id, notified_unlocked, valid_voters } = useStored()
  const num_voted = valid_voters?.filter((v) => v.has_voted).length || 0
  const unlocked_votes = useDecryptedVotes()
  const isUnlockBlocked = useIsUnlockBlocked()

  if (!election_id || !num_voted || !unlocked_votes || (!isUnlockBlocked && !unlocked_votes.length)) return null

  const more_to_unlock = num_voted > unlocked_votes.length

  return (
    <div
      className={`border border-solid rounded-md p-2.5 mr-4 mb-3.5 ${
        more_to_unlock || isUnlockBlocked
          ? '!border-[rgba(175,157,0,0.66)] !bg-[rgba(237,177,27,0.07)]'
          : 'border-[rgba(26,89,0,0.66)] bg-[rgba(0,128,0,0.07)]'
      }`}
    >
      {isUnlockBlocked ? (
        <p>
          ⚠️ Unlocking: Waiting on Privacy Protector <i className="font-medium"> {isUnlockBlocked}</i>
        </p>
      ) : !more_to_unlock ? (
        <p>
          ✅ Successfully{' '}
          <Link href={`/election/${election_id}`} legacyBehavior>
            <a className="font-medium text-blue-800 cursor-pointer" target="_blank">
              unlocked {unlocked_votes.length}
            </a>
          </Link>{' '}
          votes. <NotifyVotersUnlocked {...{ election_id, notified_unlocked, unlocked_votes }} />
        </p>
      ) : (
        <p>
          ⚠️ You unlocked {unlocked_votes.length} of {num_voted} votes.
        </p>
      )}
      <style jsx>{`
        p {
          margin: 0;
        }
      `}</style>
    </div>
  )
}

function NotifyVotersUnlocked({
  election_id,
  notified_unlocked,
  unlocked_votes,
}: {
  election_id: string
  notified_unlocked?: number
  unlocked_votes: unknown[]
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const notifiedAll = notified_unlocked === unlocked_votes.length
  if (notifiedAll) return <b className="font-semibold">Voters notified.</b>
  if (error) return <span className="text-red-500">Notifying error: {error}</span>

  return !loading ? (
    <a
      className="font-semibold cursor-pointer"
      onClick={async () => {
        setLoading(true)
        setError('')

        const response = await api(`election/${election_id}/admin/notify-unlocked`)
        revalidate(election_id)
        if (response.status !== 200) setError(response.statusText || 'Unknown error')

        setTimeout(async () => {
          setLoading(false)
        }, 500)
      }}
    >
      Notify voters? {notified_unlocked ? <b className="font-light">(Sent to {notified_unlocked})</b> : ''}
    </a>
  ) : (
    <span className="font-semibold animate-pulse">
      Notifying...&nbsp; <Spinner />
    </span>
  )
}
