import { mapValues } from 'lodash-es'
import { Dispatch, useState } from 'react'

import { api } from '../api-helper'
import { OnClickButton } from '../landing-page/Button'
import { State } from './useVoteState'

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
  const encrypted_vote = mapValues(state.encrypted, (k) => mapValues(k, (v) => v.toString()))

  const [buttonText, setButtonText] = useState('Submit')

  return (
    <div>
      <OnClickButton
        disabled={Object.keys(state.plaintext).length === 0 || buttonText !== 'Submit'}
        style={{ marginRight: 0 }}
        onClick={async () => {
          setButtonText('Submitting...')

          const { status } = await api('submit-vote', { auth, election_id, encrypted_vote })

          // Stop if there was there an error
          if (status !== 200) return setButtonText('Error')

          dispatch({ submit: 'true' })

          // Scroll page to top
          window.scrollTo(0, 0)
        }}
      >
        {buttonText}
      </OnClickButton>
      <style jsx>{`
        div {
          text-align: right;
        }
      `}</style>
    </div>
  )
}
