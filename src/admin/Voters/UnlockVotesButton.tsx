import { useReducer } from 'react'
import { api } from 'src/api-helper'

import { OnClickButton } from '../../_shared/Button'
import { useUser } from '../auth'
import { Spinner } from '../Spinner'
import { useStored } from '../useStored'

export const UnlockVotesButton = ({ num_approved, num_voted }: { num_approved: number; num_voted: number }) => {
  const { election_id, election_title, esignature_requested, trustees } = useStored()
  const show_dropdown = trustees && trustees?.length > 1
  const { user } = useUser()
  const [unlocking, toggle_unlocking] = useReducer((state) => !state, false)

  async function triggerUnlock(options?: { skip_shuffle_proofs?: boolean }) {
    const startTime = Date.now()
    const expectedTimeout = 300
    const expectedMilliseconds = (expectedTimeout - 1) * 1000

    toggle_unlocking()
    const response = await api(`election/${election_id}/admin/unlock`, { options }).catch(() => {})

    const adminMsg = `Election title: ${election_title}\nElection ID: ${election_id}\nUser: ${user.name}\nEmail: ${user.email}\nVotes: ${num_approved}`

    if (!response || response?.status !== 201) {
      if (Date.now() - startTime > expectedMilliseconds) {
        toggle_unlocking()
        api('/pushover', {
          message: adminMsg,
          title: `Admin ${user.email} unlock timeout`,
        })
        alert(`The backend server timed out after ${expectedTimeout} seconds. Alert team@siv.org for manual unlock`)
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
  }

  return (
    <div>
      <OnClickButton
        className={`bg-white !m-0 !ml-[5px] self-baseline !py-[5px] !px-2.5 ${show_dropdown && '!rounded-r-none'}`}
        disabled={!num_approved}
        disabledExplanation={
          !num_approved &&
          esignature_requested &&
          !!num_voted &&
          "No votes with approved signatures.\n\nHover over individual signatures to Approve/Reject them, or click 'Signature' column header to Approve All."
        }
        onClick={triggerUnlock}
      >
        <>
          {unlocking && <Spinner />}
          Unlock{unlocking ? 'ing' : ''} {num_approved} Vote{num_approved === 1 ? '' : 's'}
        </>
      </OnClickButton>

      {/* Dropdown arrow to skip shuffle proofs */}
      {show_dropdown && (
        <OnClickButton
          className="!m-0 bg-white !rounded-l-none !border-l-0 self-baseline !py-px !px-[7px] text-[20px] relative top-0.5"
          disabled={!num_approved}
          onClick={() => confirm('Unlock without shuffle proofs?') && triggerUnlock({ skip_shuffle_proofs: true })}
        >
          ▾
        </OnClickButton>
      )}
    </div>
  )
}
