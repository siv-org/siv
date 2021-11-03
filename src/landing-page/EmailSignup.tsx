import { NoSsr, TextField } from '@material-ui/core'
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
          onClick={async () => {
            const { status } = await api('/email-signup', {
              email: (document.getElementById('newsletter-signup-field') as HTMLInputElement).value,
            })
            if (status === 201) setSaved(true)
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
