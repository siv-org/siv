import { useReducer } from 'react'
import { api } from 'src/api-helper'

import { OnClickButton } from '../../_shared/Button'
import { Spinner } from '../Spinner'
import { useStored } from '../useStored'

export const UnlockVotesButton = ({ num_approved, num_voted }: { num_approved: number; num_voted: number }) => {
  const { election_id, esignature_requested } = useStored()
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
        toggle_unlocking()
        const response = await api(`election/${election_id}/admin/unlock`)
        if (response.status !== 201) {
          const json = await response.json()
          console.error('Unlocking error:', json)
          alert(json.error)
        }
        toggle_unlocking()
      }}
    >
      <>
        {unlocking && <Spinner countSeconds />}
        Unlock{unlocking ? 'ing' : ''} {num_approved} Vote{num_approved === 1 ? '' : 's'}
      </>
    </OnClickButton>
  )
}
