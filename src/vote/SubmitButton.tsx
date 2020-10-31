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
  encrypted: Record<string, Record<string, Big>>
}) => {
  const [status, setStatus] = useState<string>()
  const encrypted_vote = mapValues(encrypted, (v) => v.toString())
  return (
    <div>
      <OnClickButton
        disabled={disabled || !!status}
        style={{ marginRight: 0 }}
        onClick={async () => {
          setStatus('Submitting...')
          const { status } = await api('submit-vote', { auth, election_id, encrypted_vote })
          setStatus(status === 200 ? 'Submitted.' : 'Error')
        }}
      >
        {status || 'Submit'}
      </OnClickButton>
      <style jsx>{`
        div {
          text-align: right;
        }
      `}</style>
    </div>
  )
}
