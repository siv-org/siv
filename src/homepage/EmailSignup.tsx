import { TextField } from '@mui/material'
import { useState } from 'react'
import { NoSsr } from 'src/_shared/NoSsr'

import { OnClickButton } from '../_shared/Button'
import { api } from '../api-helper'

export const EmailSignup = (): JSX.Element => {
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  return (
    <>
      <h3>The Future of Voting</h3>
      <p>Sign up to receive occasional updates</p>

      <div style={{ display: 'flex', marginTop: 15 }}>
        <NoSsr>
          <TextField
            error={!!error}
            helperText={error}
            id="newsletter-signup-field"
            label="Email Address"
            size="small"
            style={{ flex: 1, marginRight: 10, maxWidth: 250 }}
            variant="outlined"
            onChange={() => {
              setSaved(false)
              setError('')
            }}
            onKeyPress={(event) =>
              event.key === 'Enter' && (document.getElementById('signup-btn') as HTMLButtonElement)?.click()
            }
          />
        </NoSsr>
        <OnClickButton
          disabled={saved}
          id="signup-btn"
          style={{ margin: 0, maxHeight: 40, padding: '8px 17px' }}
          onClick={async () => {
            setError('')
            const response = await api('email-signup', {
              email: (document.getElementById('newsletter-signup-field') as HTMLInputElement).value,
            })
            if (response.ok) return setSaved(true)
            setError((await response.json()).error)
          }}
        >
          {saved ? 'Done!' : 'Sign Up'}
        </OnClickButton>
      </div>
      <style jsx>{`
        h3 {
          font-weight: 400;
          font-size: 3.5vw;
        }

        p {
          font-size: 2vw;
        }

        @media (max-width: 700px) {
          h3 {
            font-size: 5vw;
          }

          p {
            font-size: 3.5vw;
          }
        }
      `}</style>
    </>
  )
}
