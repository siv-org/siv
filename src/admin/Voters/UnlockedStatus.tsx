import Link from 'next/link'
import { api } from 'src/api-helper'
import { useDecryptedVotes } from 'src/status/use-decrypted-votes'

import { revalidate, useStored } from '../useStored'
import { useIsUnlockBlocked } from './use-is-unlock-blocked'

export const UnlockedStatus = () => {
  const { election_id, notified_unlocked, valid_voters } = useStored()
  const num_voted = valid_voters?.filter((v) => v.has_voted).length || 0
  const unlocked_votes = useDecryptedVotes()
  const isUnlockBlocked = useIsUnlockBlocked()

  if (!num_voted || !unlocked_votes || (!isUnlockBlocked && !unlocked_votes.length)) return null

  const more_to_unlock = num_voted > unlocked_votes.length

  return (
    <div
      className={`border border-solid rounded-md p-2.5 mb-3.5 ${
        more_to_unlock || isUnlockBlocked
          ? '!border-[rgba(175,157,0,0.66)] !bg-[rgba(237,177,27,0.07)]'
          : 'border-[rgba(26,89,0,0.66)] bg-[rgba(0,128,0,0.07)]'
      }`}
    >
      {isUnlockBlocked ? (
        <p>
          ⚠️ Unlocking: Waiting on Observer <i className="font-medium"> {isUnlockBlocked}</i>
        </p>
      ) : !more_to_unlock ? (
        <p>
          ✅ Successfully{' '}
          <Link href={`/election/${election_id}`}>
            <a className="!font-medium text-black" target="_blank">
              unlocked {unlocked_votes.length}
            </a>
          </Link>{' '}
          votes.{' '}
          {notified_unlocked !== unlocked_votes.length ? (
            <a
              onClick={async () => {
                await api(`election/${election_id}/admin/notify-unlocked`)
                revalidate(election_id)
              }}
            >
              Notify voters?
            </a>
          ) : (
            <b className="font-semibold">Voters notified.</b>
          )}
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

        a {
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
