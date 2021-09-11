import { NoSsr, TextField } from '@material-ui/core'
import { firestore } from 'firebase/app'
import { useState } from 'react'
import { OnClickButton } from 'src/landing-page/Button'

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
        />
      </NoSsr>
      <OnClickButton
        disabled={saved}
        style={{ margin: 0, padding: '8px 17px' }}
        onClick={() => {
          const fields = {
            created_at: new Date().toString(),
            question: (document.getElementById('question-field') as HTMLInputElement).value,
          }

          // Store submission in Firestore
          firestore()
            .collection('faq-submissions')
            .doc(new Date().toISOString() + ' ' + String(Math.random()).slice(2, 7))
            .set(fields)
            .then(() => {
              setSaved(true)

              // Notify via Pushover
              api('pushover', {
                message: fields.question,
                title: `SIV FAQ submission`,
              })
            })
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
