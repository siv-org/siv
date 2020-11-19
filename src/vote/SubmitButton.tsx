import { mapValues } from 'lodash-es'
import { useState } from 'react'

import { api } from '../api-helper'
import { OnClickButton } from '../landing-page/Button'
import { State } from './useVoteState'

export const SubmitButton = ({ auth, election_id, state }: { auth?: string; election_id?: string; state: State }) => {
  const [status, setStatus] = useState<string>()
  const encrypted_vote = mapValues(state.encrypted, (k) => mapValues(k, (v) => v.toString()))

  const disabled = !Object.keys(state.plaintext).length

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
