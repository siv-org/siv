import { TextField } from '@mui/material'
import { validate as validateEmail } from 'email-validator'
import { useRef, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'
import { api } from 'src/api-helper'

export const AddEmailPage = ({ auth }: { auth: string }) => {
  const [email, setEmail] = useState('')
  const [errorString, setErrorString] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const submitBtn = useRef<HTMLAnchorElement>(null)

  return (
    <div className="mx-auto max-w-96">
      <h1 className="mt-8 text-3xl font-bold">Add Your Email</h1>
      <p className="text-lg font-medium opacity-50">optional</p>

      <p className="mt-10 text-xl">For administrative purposes only.</p>
      <p className="mb-10 text-lg opacity-50">Never marketing, nor shared.</p>

      <div className="flex flex-col gap-12 items-center">
        <div>
          <TextField
            autoFocus
            className="w-full min-h-20"
            error={!!errorString}
            helperText={errorString}
            InputLabelProps={{ style: { fontSize: 22 } }}
            InputProps={{ style: { fontSize: 22 } }}
            label="Email"
            onChange={(event) => {
              setEmail(event.target.value.trim())
              setErrorString('')
            }}
            placeholder="you@email.com"
            type="email"
          />
          <p>Helps with any issues processing your vote</p>
        </div>

        <OnClickButton
          className="w-full text-xl text-center max-w-80"
          disabled={!!errorString || submitting}
          onClick={async () => {
            if (!email)
              if (!confirm("Are you sure?\n\nWe won't be able to contact you if there are unforeseen issues.")) return

            if (email && !validateEmail(email)) return setErrorString('Invalid email address')

            setSubmitting(true)

            // Submit to server
            const response = await api(`11-chooses/submit-email`, { auth_token: auth, email })
            setSubmitting(false)

            // Handle errors from server
            if (!response.ok) {
              const responseJson = await response.json()
              if (!responseJson?.error) {
                console.error('submission responseJson', responseJson)
                return setErrorString('Unknown error')
              }
              console.error('submission responseJson.error', responseJson?.error)
              return setErrorString(responseJson?.error)
            }

            // Redirect to next screen by adding query param `passed_yob`
            // router.replace(`${router.asPath}&passed_yob=true&email=true`)
          }}
          ref={submitBtn}
          style={{ margin: 0, padding: '19px 15px' }}
        >
          <>{!email ? 'Skip' : `Submit${submitting ? 'ting...' : ''}`}</>
        </OnClickButton>
      </div>
    </div>
  )
}
