import { api } from 'src/api-helper'
import { useDecryptedVotes } from 'src/status/use-decrypted-votes'

import { useStored } from '../useStored'

export const UnlockedStatus = () => {
  const { election_id, notified_unlocked } = useStored()
  const votes = useDecryptedVotes()

  if (!votes || !votes.length) return null

  return (
    <div>
      <p>
        ✅ Successfully unlocked {votes.length} votes.{' '}
        {notified_unlocked !== votes.length ? (
          <a
            onClick={() => {
              api(`election/${election_id}/admin/notify-unlocked`)
            }}
          >
            Notify voters?
          </a>
        ) : (
          <b>Voters notified.</b>
        )}
      </p>
      <style jsx>{`
        div {
          border: 1px solid rgba(26, 89, 0, 0.66);
          background: rgba(0, 128, 0, 0.07);
          border-radius: 5px;

          padding: 10px;
          margin-bottom: 15px;
        }

        p {
          margin: 0;
        }

        a {
          font-weight: 600;
          cursor: pointer;
        }

        b {
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}
