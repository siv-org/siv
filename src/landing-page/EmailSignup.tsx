import { NoSsr, TextField } from '@material-ui/core'
import { firestore } from 'firebase/app'
import { useState } from 'react'

import { api } from '../api-helper'
import { OnClickButton } from './Button'

export const EmailSignup = (): JSX.Element => {
  const [saved, setSaved] = useState(false)

  return (
    <>
      <h3>The Future of Voting</h3>
      <p>Sign up to receive occasional updates</p>

      <div style={{ display: 'flex', marginTop: 15 }}>
        <NoSsr>
          <TextField
            id="newsletter-signup-field"
            label="Email Address"
            size="small"
            style={{ flex: 1, marginRight: 10, maxWidth: 250 }}
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
              email: (document.getElementById('newsletter-signup-field') as HTMLInputElement).value,
            }

            // Store submission in Firestore
            firestore()
              .collection('news-signups')
              .doc(new Date().toISOString() + ' ' + String(Math.random()).slice(2, 7))
              .set(fields)
              .then(() => {
                setSaved(true)

                // Notify via Pushover
                api('pushover', {
                  message: fields.email,
                  title: `SIV newsletter signup`,
                })
              })
          }}
        >
          {saved ? 'Done!' : 'Sign Up'}
        </OnClickButton>
      </div>
      <style jsx>{`
        h3 {
          font-weight: 400;
          font-size: 28px;
        }

        p {
          font-size: 16px;
        }
      `}</style>
    </>
  )
}
