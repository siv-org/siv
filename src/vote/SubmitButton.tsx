import { mapValues } from 'lodash-es'
import { useState } from 'react'

import { api } from '../api-helper'
import { Big } from '../crypto/types'
import { OnClickButton } from '../landing-page/Button'

export const SubmitButton = ({
  auth,
  disabled,
  election_id,
  encrypted,
}: {
  auth?: string
  disabled?: boolean
  election_id?: string
  encrypted: Record<string, Big>
}) => {
  const [sent, setSent] = useState(false)
  const encrypted_vote = mapValues(encrypted, (v) => v.toString())
  return (
    <div>
      <OnClickButton
        disabled={disabled || sent}
        onClick={async () => {
          const { status } = await api('submit-vote', { auth, election_id, encrypted_vote })
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
