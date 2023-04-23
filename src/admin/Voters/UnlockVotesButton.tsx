import { useReducer } from 'react'
import { api } from 'src/api-helper'

import { OnClickButton } from '../../_shared/Button'
import { useUser } from '../auth'
import { Spinner } from '../Spinner'
import { useStored } from '../useStored'

export const UnlockVotesButton = ({ num_approved, num_voted }: { num_approved: number; num_voted: number }) => {
  const { election_id, election_title, esignature_requested } = useStored()
  const { user } = useUser()
  const [unlocking, toggle_unlocking] = useReducer((state) => !state, false)

  return (
    <OnClickButton
      disabled={!num_approved}
      disabledExplanation={
        !num_approved &&
        esignature_requested &&
        !!num_voted &&
        "No votes with approved signatures.\n\nHover over individual signatures to Approve/Reject them, or click 'Signature' column header to Approve All."
      }
      style={{ alignSelf: 'baseline', margin: 0, marginLeft: 5, padding: '5px 10px' }}
      onClick={async () => {
        const startTime = Date.now()
        const expectedTimeout = 60
        const expectedMilliseconds = (expectedTimeout - 1) * 1000

        toggle_unlocking()
        const response = await api(`election/${election_id}/admin/unlock`).catch(() => {})

        const adminMsg = `Election title: ${election_title}\nElection ID: ${election_id}\nUser: ${user.name}\nEmail: ${user.email}\nVotes: ${num_approved}`

        if (!response || response?.status !== 201) {
          if (Date.now() - startTime > expectedMilliseconds) {
            toggle_unlocking()
            api('/pushover', {
              message: adminMsg,
              title: `Admin ${user.email} unlock timeout`,
            })
            alert('The backend server timed out after 60 seconds. Alert team@siv.org for manual unlock')
            return
          }

          const json = await response?.json()
          console.error('Unlocking error:', json)

          api('/pushover', {
            message: `${adminMsg}\nError: ${JSON.stringify(json)}`,
            title: `Admin ${user.email} unlock error`,
          })

          if (json) {
            alert(JSON.stringify(json.error))
          } else {
            alert('Unknown error during unlocking')
          }
        }
        toggle_unlocking()
      }}
    >
      <>
        {unlocking && <Spinner />}
        Unlock{unlocking ? 'ing' : ''} {num_approved} Vote{num_approved === 1 ? '' : 's'}
      </>
    </OnClickButton>
  )
}
