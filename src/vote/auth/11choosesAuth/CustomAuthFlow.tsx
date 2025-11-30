import { TextField } from '@mui/material'
import { useRef, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'
import { TailwindPreflight } from 'src/TailwindPreflight'

export const test_election_id_11chooses = '1764391039716' // 11_chooses Test Auth

export const hasCustomAuthFlow = (election_id: string) => election_id === test_election_id_11chooses

export const CustomAuthFlow = ({ auth }: { auth: string }) => {
  const [errorString, setErrorString] = useState('')
  const [yearOfBirth, setYearOfBirth] = useState('')
  const submitBtn = useRef<HTMLAnchorElement>(null)
  const [submitting, setSubmitting] = useState(false)

  // todo: query voter info via auth_token
  void auth

  return (
    <div className="text-center">
      <h1 className="mt-8 text-3xl font-bold">Your vote is now pending</h1>

      <p className="mt-8">The unique Voter Code you used was for:</p>
      <p className="mt-3 text-lg font-semibold">ALICE JONES</p>
      <a className="block text-sm text-blue-600/50 hover:underline" href="#">
        Not you?
      </a>

      <p className="mt-12 text-lg">Confirm your Year of Birth</p>
      <p className="mb-4 text-sm opacity-50">as listed in the State Voter Roll</p>

      <div className="flex flex-col gap-12 items-center">
        <div className="text-center">
          <div className="min-h-24">
            <TextField
              autoFocus
              error={!!errorString}
              helperText={errorString}
              InputLabelProps={{ style: { fontSize: 22 } }}
              InputProps={{ style: { fontSize: 22 } }}
              label="Year of Birth (YYYY)"
              onChange={(event) => {
                setErrorString('')
                const newValue = event.target.value
                setYearOfBirth(newValue)

                if (newValue && !/\d$/.test(newValue)) return setErrorString('Numbers only')
                if (newValue.length > 4) return setErrorString('4 digits only')

                // Edge cases once 4 digits entered
                if (newValue.length < 4) return
                if (Number(newValue) < 1880) return setErrorString(`You're ${2025 - Number(newValue)} years old?`)
                if (Number(newValue) > 2025) return setErrorString("You haven't been born yet?")
                if (Number(newValue) > 2025 - 18) return setErrorString('You must be at least 18 years old')
              }}
              onKeyDown={(event) => event.key === 'Enter' && submitBtn?.current?.click()}
              style={{ fontSize: 20 }}
              variant="outlined"
            />
          </div>

          <p className="text-sm opacity-50">Protects against strangers trying to use your code</p>
        </div>

        <OnClickButton
          className="w-full text-xl text-center max-w-80"
          disabled={!yearOfBirth || !!errorString || submitting}
          onClick={async () => {
            setSubmitting(true)

            // Submit to server
            // const response = await api(`election/${election_id}/submit-link-auth-info`, payload)
            // setSubmitting(false)
            //
            // Handle errors from server
            // if (!response.ok) {
            //   const responseJson = await response.json()
            //   if (!responseJson?.error) {
            //     console.error('submission responseJson', responseJson)
            //     return setSubmissionError('Unknown error')
            //   }
            //   console.error('submission responseJson.error', responseJson?.error)
            //   return setSubmissionError(responseJson?.error)
            // }
            //
            // Redirect to next screen
            //
          }}
          ref={submitBtn}
          style={{ margin: 0, padding: '19px 15px' }}
        >
          <>Submit{submitting ? 'ting...' : ''}</>
        </OnClickButton>
      </div>

      <TailwindPreflight />
    </div>
  )
}
