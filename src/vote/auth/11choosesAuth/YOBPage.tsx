import { SafetyOutlined } from '@ant-design/icons'
import { TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'
import { api } from 'src/api-helper'

import { useWarnOnClose } from './useWarnOnClose'

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
  const [contactInfoForHelp, setContactInfoForHelp] = useState('')
  const [submittingHelp, setSubmittingHelp] = useState(false)
  const helpSubmitBtn = useRef<HTMLAnchorElement>(null)
  const [submittedHelp, setSubmittedHelp] = useState(false)

  const submitBtn = useRef<HTMLAnchorElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const [showHelpInstructions, setShowHelpInstructions] = useState(false)
  useWarnOnClose()

  return (
    <div className="px-6 py-8 mx-auto mt-10 max-w-xl text-slate-900">
      <div className="space-y-8">
        {/* Heading + voter context */}
        <div className="space-y-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Last step to
            <br /> finish your vote submission
          </h1>

          <div className="space-y-2">
            <p className="text-base text-slate-600">The unique Voter Code you used was for:</p>
            <p className="text-xl font-semibold text-slate-900">{is_withheld ? 'WITHHELD VOTER' : voterName}</p>

            {/* "Not you?" / "Why Withheld?" link */}
            <a
              className="inline-block text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-700 hover:underline"
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

        {/* Confirm: Year of Birth + input block */}
        <div className="px-5 py-10 space-y-6 rounded-2xl border shadow-sm border-slate-100 bg-slate-50">
          <div className="space-y-1 text-center">
            <p className="text-xl font-semibold md:text-lg">Confirm your Year of Birth</p>
            <p className="text-base md:text-sm text-slate-500">as listed in the State Voter Roll</p>
          </div>

          <div className="flex flex-col gap-6 items-center">
            <div className="w-full max-w-xs text-center">
              <TextField
                autoFocus
                className="w-full min-h-24"
                error={!!errorString}
                helperText={errorString}
                InputLabelProps={{ style: { fontSize: 22 } }}
                InputProps={{ style: { backgroundColor: 'white', fontSize: 22 } }}
                label="Year of Birth (YYYY)"
                onChange={(event) => {
                  setErrorString('')
                  // setShowHelpInstructions(false) // Leave help instructions once shown

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

              <p className="text-sm italic font-medium">
                Only votes with a correctly matched
                <br /> Year of Birth will be counted.
              </p>

              <p className="mt-4 text-sm text-slate-700">
                <SafetyOutlined className="mr-1.5 text-lg text-green-800 relative top-px" />
                Protects against strangers using your code
              </p>
            </div>

            {/* Submit button */}
            <OnClickButton
              className="w-full max-w-xs text-base font-semibold text-center"
              disabled={yearOfBirth.length !== 4 || !!errorString || submitting}
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
        </div>

        {/* Show help instructions on submission errors */}
        <div className={`${showHelpInstructions ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
          <div
            className={`px-4 py-4 mx-auto max-w-md text-sm text-center text-pink-900 rounded-2xl border border-pink-200 shadow-sm bg-pink-50/80`}
          >
            <p className="mt-3 text-xl font-semibold">
              Sorry you are having trouble. <br />
            </p>
            <p className="mt-3 text-2xl">
              Enter your <br />
              <b className="font-semibold">email</b> or <b className="font-semibold">phone number</b>,<br /> & we can
              contact you to help:
            </p>
            <input
              className="px-3 py-6 my-2 w-full text-2xl text-black rounded-lg border"
              onChange={(event) => {
                setContactInfoForHelp(event.target.value)
                setSubmittedHelp(false)
              }}
              onKeyDown={(event) => event.key === 'Enter' && helpSubmitBtn?.current?.click()}
              placeholder="email or phone number"
              type="email"
              value={contactInfoForHelp}
            />
            <OnClickButton
              className="!m-0 !mt-2 w-full text-xl"
              disabled={!contactInfoForHelp || submittingHelp || submittedHelp}
              onClick={() => {
                setSubmittingHelp(true)
                api(`11-chooses/get-yob-help`, { auth_token: auth, contactInfoForHelp, election_id })
                setSubmittingHelp(false)
                setSubmittedHelp(true)
              }}
              ref={helpSubmitBtn}
            >
              <>Submit{submittingHelp ? 'ting...' : submittedHelp ? 'ted.' : ''}</>
            </OnClickButton>
            <p className="mt-6 text-lg">
              Or email{' '}
              <a className="font-semibold text-blue-700 hover:underline" href="mailto:11chooses@siv.org">
                11chooses@siv.org
              </a>
            </p>
          </div>
          <p className="mt-3 text-base">Your information is only to help voting, never marketing.</p>
        </div>
      </div>
    </div>
  )
}
