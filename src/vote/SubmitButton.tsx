import { mapValues } from 'lodash-es'
import { Dispatch, SetStateAction } from 'react'

import { api } from '../api-helper'
import { OnClickButton } from '../landing-page/Button'
import { State } from './useVoteState'

export const SubmitButton = ({
  auth,
  election_id,
  setSubmissionStatus,
  state,
  submission_status,
}: {
  auth?: string
  election_id?: string
  setSubmissionStatus: Dispatch<SetStateAction<string | undefined>>
  state: State
  submission_status?: string
}) => {
  const encrypted_vote = mapValues(state.encrypted, (k) => mapValues(k, (v) => v.toString()))

  const disabled = !Object.keys(state.plaintext).length

  return (
    <div>
      <OnClickButton
        disabled={disabled || !!submission_status}
        style={{ marginRight: 0 }}
        onClick={async () => {
          setSubmissionStatus('Submitting...')
          const { status } = await api('submit-vote', { auth, election_id, encrypted_vote })
          setSubmissionStatus(status === 200 ? 'Submitted.' : 'Error')
        }}
      >
        {submission_status || 'Submit'}
      </OnClickButton>
      <style jsx>{`
        div {
          text-align: right;
        }
      `}</style>
    </div>
  )
}
