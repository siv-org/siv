import { useState } from 'react'

import { api } from '../api-helper'
import { OnClickButton } from '../landing-page/Button'

export const SubmitButton = ({
  auth,
  disabled,
  election_id,
  encryptedString,
}: {
  auth?: string
  disabled?: boolean
  election_id?: string
  encryptedString: string
}) => {
  const [sent, setSent] = useState(false)
  return (
    <div>
      <OnClickButton
        disabled={disabled || sent}
        onClick={async () => {
          const { status } = await api('submit-vote', { auth, election_id, encryptedString })
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
