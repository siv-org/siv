import * as Sentry from '@sentry/browser'
import router, { useRouter } from 'next/router'
import { Dispatch, useEffect, useState } from 'react'

import { OnClickButton } from '../_shared/Button'
import { api } from '../api-helper'
import { AirGappedSubmission } from './AirGappedSubmission'
import { generateColumnNames } from './generateColumnNames'
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
  const [expectedColumns, setExpectedColumns] = useState<null | string[]>(null)
  const { embed } = useRouter().query as { embed?: string }

  useEffect(() => {
    // The SubmitButton's onClick might add missing BLANKs (to avoid visible holes)
    // but these additions are asynchronous, so this useEffect waits for them to finish.

    // Before Submit.onClick, expectedColumns=null
    if (expectedColumns === null) return

    // Check if all expected columns exist in state.encrypted
    const allPresent = expectedColumns.every((columnId) => state.encrypted[columnId])
    if (!allPresent) return
    ;(async () => {
      // All columns are present, submit now
      const response = await api('submit-vote', {
        auth,
        election_id,
        embed,
        encrypted_vote: state.encrypted,
      })

      // Stop if there was an error
      if (response.status !== 200) {
        const { error } = (await response.json()) as { error: string }
        Sentry.captureMessage(error, {
          extra: { auth, election_id, encrypted_vote: state.encrypted },
          level: 'error',
        })
        console.log(error)

        if (error.startsWith('Vote already recorded')) {
          setButtonText('Submitted.')
        } else {
          setButtonText('Error')
        }

        return setExpectedColumns(null)
      }

      // If auth is `link`, redirect to /auth page
      if (auth === 'link') {
        const { link_auth, visit_to_add_auth } = await response.json()
        if (embed) {
          // console.log('SIV submit button', link_auth, embed)
          window.parent.postMessage({ link_auth }, embed)
          dispatch({ submitted_at: new Date().toString() })
        }

        if (visit_to_add_auth) router.push(visit_to_add_auth)
      }

      dispatch({ submitted_at: new Date().toString() })
      setExpectedColumns(null)

      // Scroll page to top
      window.scrollTo(0, 0)
    })()
  }, [expectedColumns, state.encrypted, auth, election_id, embed, dispatch])

  return (
    <>
      <AirGappedSubmission {...{ auth, election_id, state }} />

      <div className="text-right">
        <OnClickButton
          disabled={
            !state.ballot_design_finalized ||
            !state.public_key ||
            Object.values(state.plaintext).filter((v) => v !== 'BLANK').length === 0 ||
            buttonText !== 'Submit'
          }
          onClick={() => {
            if (state.submission_confirmation) {
              if (!confirm(state.submission_confirmation)) return
            }

            if (auth === 'preview') return alert('You are in preview mode.\n\nNot submitting.')

            // Guard against multiple clicks
            if (expectedColumns !== null) return

            setButtonText('Submitting...')

            // Determine expected columns from ballot design (type-agnostic)
            const { columns } = generateColumnNames({ ballot_design: state.ballot_design })

            // Check which columns are missing from state.encrypted
            const missingColumns = columns.filter((columnId) => !state.encrypted[columnId])

            // Dispatch BLANKs for missing columns
            if (missingColumns.length > 0) {
              const blanksToDispatch: Record<string, string> = {}
              missingColumns.forEach((columnId) => (blanksToDispatch[columnId] = 'BLANK'))

              dispatch(blanksToDispatch)
            }

            // Always set expectedColumns, for useEffect to wait for
            setExpectedColumns(columns)
          }}
          style={{ marginRight: 0 }}
        >
          {buttonText}
        </OnClickButton>
      </div>
    </>
  )
}
