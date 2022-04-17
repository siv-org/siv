import { NoSsr, TextField } from '@material-ui/core'
import { useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'

import { api } from '../api-helper'

export const AddYourQuestion = () => {
  const [saved, setSaved] = useState(false)
  return (
    <div>
      <NoSsr>
        <TextField
          id="question-field"
          label="Add your question"
          size="small"
          style={{ flex: 1, marginRight: 10 }}
          variant="outlined"
          onChange={() => setSaved(false)}
          onKeyPress={(event) =>
            event.key === 'Enter' && (document.getElementById('submit-btn') as HTMLButtonElement)?.click()
          }
        />
      </NoSsr>
      <OnClickButton
        disabled={saved}
        id="submit-btn"
        style={{ margin: 0, padding: '8px 17px' }}
        onClick={async () => {
          const { status } = await api('faq-submission', {
            question: (document.getElementById('question-field') as HTMLInputElement).value,
          })
          if (status === 201) setSaved(true)
        }}
      >
        {saved ? 'Done!' : 'Submit'}
      </OnClickButton>
      <style jsx>{`
        div {
          width: 100%;
          display: flex;
        }
      `}</style>
    </div>
  )
}
