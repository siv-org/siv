import { useState } from 'react'

import { api } from '../api-helper'
import { OnClickButton } from '../landing-page/Button'

export const SubmitButton = ({
  authToken,
  disabled,
  electionId,
  encryptedString,
}: {
  authToken?: string
  disabled?: boolean
  electionId?: string
  encryptedString: string
}) => {
  const [sent, setSent] = useState(false)
  return (
    <div>
      <OnClickButton
        disabled={disabled || sent}
        onClick={async () => {
          const { status } = await api('submit-vote', { authToken, electionId, encryptedString })
          setSent(status === 200)
        }}
      >
        {!sent ? 'Submit' : 'Submitted.'}
      </OnClickButton>
      <style jsx>{`
        div {
          text-align: right;
        }
      `}</style>
    </div>
  )
}
