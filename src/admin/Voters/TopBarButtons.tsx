import { useState } from 'react'
import { useWindowDimensions } from 'src/protocol/useWindowDimensions'

import { InvalidateVotersButton } from './InvalidateVotersButton'
import { SendInvitationsButton } from './SendInvitationsButton'
import { UnlockVotesButton } from './UnlockVotesButton'

export const TopBarButtons = ({
  checked,
  clear_checked,
  num_approved,
  num_voted,
}: {
  checked: boolean[]
  clear_checked: () => void
  num_approved: number
  num_voted: number
}) => {
  const num_checked = checked.filter((c) => c).length
  const [error, set_error] = useState('')
  const { width } = useWindowDimensions()

  return (
    <div className="flex justify-between mb-[5px]">
      <div className={`flex ${width < 400 ? 'flex-col' : 'flex-row'}`}>
        <SendInvitationsButton {...{ checked, num_checked, set_error }} />
        <InvalidateVotersButton {...{ checked, clear_checked, num_checked, set_error }} />
      </div>
      {error && (
        <span className="self-start border border-solid border-[#800a] py-[3px] px-2.5 rounded bg-[#fff6f6] max-w-[320px]">
          <b> ⚠️ Error:</b> {error}
          <a className="ml-2.5 cursor-pointer" onClick={() => set_error('')}>
            x
          </a>
        </span>
      )}

      <UnlockVotesButton {...{ num_approved, num_voted }} />
    </div>
  )
}
