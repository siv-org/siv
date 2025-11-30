import { TextField } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'
import { api } from 'src/api-helper'
import { TailwindPreflight } from 'src/TailwindPreflight'

export const test_election_id_11chooses = '1764391039716'

export const hasCustomAuthFlow = (election_id: string) => election_id === test_election_id_11chooses

export const CustomAuthFlow = ({ auth }: { auth: string }) => {
  const [errorString, setErrorString] = useState('')
  const [yearOfBirth, setYearOfBirth] = useState('')
  const submitBtn = useRef<HTMLAnchorElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const { loaded, voterName } = useVoterInfo(auth)

  return (
    <div className="text-center">
      <h1 className="mt-8 text-3xl font-bold">Your vote is now pending</h1>

      {/* While loading voter info */}
      {!loaded ? (
        <p className="mt-8 text-lg italic animate-pulse text-black/50">Loading voter info...</p>
      ) : (
        // Loaded voter info
        <>
          {/* Voter name */}
          <p className="mt-8">The unique Voter Code you used was for:</p>
          <p className="mt-3 text-lg font-semibold">{voterName}</p>

          {/* Not you? */}
          <a
            className="inline-block p-1 -mt-1 text-sm cursor-pointer text-blue-600/50 hover:underline"
            onClick={() => {
              api('/pushover', {
                message: `auth_token: ${auth}`,
                title: '11chooses/YOB: pressed "Not you?"',
              })
              alert('Please email 11chooses@siv.org for help')
            }}
          >
            Not you?
          </a>

          {/* Confirm: Year of Birth */}
          <p className="mt-12 text-lg">Confirm your Year of Birth</p>
          <p className="mb-4 text-sm opacity-50">as listed in the State Voter Roll</p>

          <div className="flex flex-col gap-12 items-center">
            <div className="text-center">
              <TextField
                autoFocus
                className="min-h-24"
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
                type="tel"
                variant="outlined"
              />

              <p className="text-sm opacity-50">Protects against strangers trying to use your code</p>
            </div>

            {/* Submit button */}
            <OnClickButton
              className="w-full text-xl text-center max-w-80"
              disabled={!yearOfBirth || !!errorString || submitting}
              onClick={async () => {
                setSubmitting(true)

                // Submit to server
                const response = await api(`11-chooses/submit-yob`, { auth_token: auth, yearOfBirth })
                setSubmitting(false)
                //
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
        </>
      )}

      <TailwindPreflight />
    </div>
  )
}

export type VoterInfo = { voterName: string }
/** Query server for voter info, via `auth_token` */
function useVoterInfo(auth: string) {
  const [voterInfo, setVoterInfo] = useState<VoterInfo & { loaded: boolean }>({ loaded: false, voterName: '' })

  useEffect(() => {
    async function getVoterInfo() {
      const response = await api(`11-chooses/get-voter-auth`, { auth_token: auth })
      if (!response.ok) {
        console.error('Failed to get voter info:', +JSON.stringify(response))
        return alert('Failed to get voter info:' + JSON.stringify(response))
        // return
      }

      const voterInfo = await response.json()
      // console.log({ voterInfo })
      setVoterInfo({ loaded: true, ...voterInfo })
    }
    getVoterInfo()
  }, [auth])

  return voterInfo
}
