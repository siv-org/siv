import * as Sentry from '@sentry/browser'
import { Dispatch, useState } from 'react'

import { OnClickButton } from '../_shared/Button'
import { api } from '../api-helper'
import { State } from './vote-state'

export const SubmitButton = ({
  auth,
  dispatch,
  election_id,
  state,
}: {
  auth?: string
  dispatch: Dispatch<Record<string, string>>
  election_id?: string
  state: State
}) => {
  const [buttonText, setButtonText] = useState('Submit')

  return (
    <div className="text-right">
      <OnClickButton
        disabled={
          !state.ballot_design_finalized ||
          !state.public_key ||
          Object.keys(state.plaintext).length === 0 ||
          buttonText !== 'Submit'
        }
        style={{ marginRight: 0 }}
        onClick={async () => {
          setButtonText('Submitting...')

          // Add plaintext "BLANK" for questions left blank
          state.ballot_design?.map((item) => {
            const id = item.id || 'vote'

            if (state.plaintext[id]) return
            if (item.multiple_votes_allowed) return
            if (item.type === 'ranked-choice-irv') return

            dispatch({ [id]: 'BLANK' })
          })

          const response = await api('submit-vote', { auth, election_id, encrypted_vote: state.encrypted })

          // Stop if there was there an error
          if (response.status !== 200) {
            const { error } = (await response.json()) as { error: string }
            Sentry.captureMessage(error, {
              extra: { auth, election_id, encrypted_vote: state.encrypted },
              level: Sentry.Severity.Error,
            })
            console.log(error)

            if (error.startsWith('Vote already recorded')) return setButtonText('Submitted.')

            return setButtonText('Error')
          }

          dispatch({ submitted_at: new Date().toString() })

          // Scroll page to top
          window.scrollTo(0, 0)
        }}
      >
        {buttonText}
      </OnClickButton>
    </div>
  )
}
