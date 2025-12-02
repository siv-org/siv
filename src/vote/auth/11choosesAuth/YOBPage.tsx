import { TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'
import { api } from 'src/api-helper'

export const YOBPage = ({
  auth,
  election_id,
  is_withheld,
  voterName,
}: {
  auth: string
  election_id: string
  is_withheld: boolean
  voterName: string
}) => {
  const [errorString, setErrorString] = useState('')
  const [yearOfBirth, setYearOfBirth] = useState('')
  const submitBtn = useRef<HTMLAnchorElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const [showHelpInstructions, setShowHelpInstructions] = useState(false)

  return (
    <div className="px-6 py-8 mx-auto mt-10 max-w-xl rounded-3xl ring-1 shadow-sm backdrop-blur-sm bg-white/80 text-slate-900 ring-black/5">
      <div className="space-y-8">
        {/* Heading + voter context */}
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Your vote is now pending</h1>

          <div className="space-y-2">
            <p className="text-base text-slate-600">The unique Voter Code you used was for:</p>
            <p className="text-xl font-semibold text-slate-900">{is_withheld ? 'WITHHELD VOTER' : voterName}</p>

            {/* "Not you?" / "Why Withheld?" link */}
            <a
              className="inline-block text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              onClick={() => {
                if (is_withheld) return alert('Voters can opt to withhold their name from the state voter file.')

                // For "Not you?"
                api('/pushover', {
                  message: `auth_token: ${auth}`,
                  title: '11chooses/YOB: pressed "Not you?"',
                })
                alert('Please email 11chooses@siv.org for help')
              }}
            >
              {is_withheld ? 'Why Withheld?' : 'Not you?'}
            </a>
          </div>
        </div>

        {/* Confirm: Year of Birth */}
        <div className="space-y-1 text-center">
          <p className="text-lg font-semibold">Confirm your Year of Birth</p>
          <p className="text-sm text-slate-500">as listed in the State Voter Roll</p>
        </div>

        <div className="flex flex-col gap-6 items-center">
          <div className="w-full max-w-xs text-center">
            <TextField
              autoFocus
              className="w-full min-h-24"
              error={!!errorString}
              helperText={errorString}
              InputLabelProps={{ style: { fontSize: 22 } }}
              InputProps={{ style: { fontSize: 22 } }}
              label="Year of Birth (YYYY)"
              onChange={(event) => {
                setErrorString('')
                setShowHelpInstructions(false)

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
              type="tel"
              variant="outlined"
            />

            <p className="mt-2 text-sm whitespace-nowrap text-slate-700">
              Protects against strangers trying to use your code
            </p>
          </div>

          {/* Submit button */}
          <OnClickButton
            className="w-full max-w-xs text-base font-semibold text-center"
            disabled={!yearOfBirth || !!errorString || submitting}
            onClick={async () => {
              setSubmitting(true)

              // Submit to server
              const response = await api(`11-chooses/submit-yob`, { auth_token: auth, election_id, yearOfBirth })
              setSubmitting(false)

              // Handle errors from server
              if (!response.ok) {
                setShowHelpInstructions(true)

                const responseJson = await response.json()
                if (!responseJson?.error) {
                  console.error('submission responseJson', responseJson)
                  return setErrorString('Unknown error')
                }
                console.error('submission responseJson.error', responseJson?.error)
                return setErrorString(responseJson?.error)
              }

              // Redirect to next screen by adding query param `passed_yob`
              router.replace(`${router.asPath}&passed_yob=true`)
            }}
            ref={submitBtn}
            style={{ margin: 0, padding: '19px 15px' }}
          >
            <>Submit{submitting ? 'ting...' : ''}</>
          </OnClickButton>
        </div>

        {/* Show help instructions on submission errors */}
        <p
          className={`mx-auto max-w-md rounded-2xl border border-pink-200 bg-pink-50/80 px-3 py-2 text-center text-sm font-medium text-pink-900 shadow-sm transition-opacity duration-700 ${
            showHelpInstructions ? 'opacity-100' : 'opacity-0'
          }`}
        >
          For help, email{' '}
          <a className="font-semibold text-blue-700 hover:underline" href="mailto:11chooses@siv.org">
            11chooses@siv.org
          </a>
        </p>
      </div>
    </div>
  )
}
