import { TextField } from '@mui/material'
import { useState } from 'react'
import { NoSsr } from 'src/_shared/NoSsr'

import { OnClickButton } from '../_shared/Button'
import { api } from '../api-helper'

export const EmailSignup = (): JSX.Element => {
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  return (
    <div className="w-full">
      <h3 className="mb-3 text-3xl font-normal text-center md:text-left">The Future of Voting</h3>
      <p className="mb-6 text-lg text-center text-gray-600 md:text-left">Sign up to receive occasional updates</p>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <NoSsr>
          <TextField
            className="w-full sm:w-80"
            error={!!error}
            helperText={error}
            id="newsletter-signup-field"
            label="Email Address"
            onChange={() => {
              setSaved(false)
              setError('')
            }}
            onKeyPress={(event) =>
              event.key === 'Enter' && (document.getElementById('signup-btn') as HTMLButtonElement)?.click()
            }
            size="small"
            variant="outlined"
          />
        </NoSsr>
        <OnClickButton
          className="flex items-center justify-center w-full h-10 px-6 !m-0 font-medium sm:w-auto"
          disabled={saved}
          id="signup-btn"
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
    </div>
  )
}
