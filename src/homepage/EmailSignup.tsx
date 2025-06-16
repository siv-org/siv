import { TextField } from '@mui/material'
import { useState } from 'react'
import { NoSsr } from 'src/_shared/NoSsr'

import { OnClickButton } from '../_shared/Button'
import { api } from '../api-helper'

export const EmailSignup = (): JSX.Element => {
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  return (
    <div className="text-center md:text-left">
      <h3 className="mb-3 text-3xl font-normal">The Future of Voting</h3>
      <p className="mb-6 text-lg text-gray-600">Sign up to receive occasional updates</p>

      <div className="flex flex-col gap-4 md:flex-row max-w-[400px] mx-auto">
        <NoSsr>
          <TextField
            className="w-full md:w-80"
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
          className="!flex items-center justify-center w-full h-10 !m-0 md:w-auto whitespace-nowrap"
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
