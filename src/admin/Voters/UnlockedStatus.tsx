import { api } from 'src/api-helper'
import { useDecryptedVotes } from 'src/status/use-decrypted-votes'

import { useStored } from '../useStored'

export const UnlockedStatus = () => {
  const { election_id, notified_unlocked, valid_voters } = useStored()
  const num_voted = valid_voters?.filter((v) => v.has_voted).length || 0
  const unlocked_votes = useDecryptedVotes()

  if (!num_voted || !unlocked_votes || !unlocked_votes.length) return null

  const more_to_unlock = num_voted > unlocked_votes.length

  return (
    <div>
      {!more_to_unlock ? (
        <p>
          ✅ Successfully unlocked {unlocked_votes.length} votes.{' '}
          {notified_unlocked !== unlocked_votes.length ? (
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
      ) : (
        <p>
          ⚠️ You unlocked {unlocked_votes.length} of {num_voted} votes.
        </p>
      )}
      <style jsx>{`
        div {
          border: 1px solid ${!more_to_unlock ? 'rgba(26, 89, 0, 0.66)' : 'rgba(175, 157, 0, 0.66)'};
          background: ${!more_to_unlock ? 'rgba(0, 128, 0, 0.07)' : 'rgba(237, 177, 27, 0.07)'};
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
