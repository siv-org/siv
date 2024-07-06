import { useState } from 'react'
import { useWindowDimensions } from 'src/protocol/useWindowDimensions'

import { InvalidateVotersButton } from './InvalidateVotersButton'
import { SendInvitationsButton } from './SendInvitationsButton'
import { UnlockVotesButton } from './UnlockVotesButton'

export const TopBarButtons = ({
  checked,
  num_approved,
  num_voted,
}: {
  checked: boolean[]
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
        <InvalidateVotersButton {...{ checked, num_checked, set_error }} />
      </div>
      {error && (
        <span className="error">
          <b> ⚠️ Error:</b> {error}
          <a onClick={() => set_error('')}>x</a>
        </span>
      )}

      <UnlockVotesButton {...{ num_approved, num_voted }} />

      <style jsx>{`
        .error {
          align-self: center;
          border: 1px solid rgba(131, 1, 1, 0.776);
          border-radius: 3px;
          padding: 3px 10px;
          background: rgb(255, 246, 246);
          max-width: 320px;
        }

        .error a {
          margin-left: 10px;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
