import { TextField } from '@material-ui/core'
import { ElectionInfo } from 'api/election/[election_id]/info'
import router, { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Spinner } from 'src/admin/Spinner'

import { OnClickButton } from '../_shared/Button'
import { VoterRegistrationForm } from './VoterRegistrationForm'

export const EnterAuthToken = () => {
  const { election_title, loaded, voter_applications_allowed } = useElectionInfo()
  const [error, setError] = useState('')
  const [text, setText] = useState('')
  const [openedVoterAuthInput, setOpenedVoterAuthInput] = useState(false)
  useEffect(() => setOpenedVoterAuthInput(!voter_applications_allowed), [voter_applications_allowed])

  const [openedRegistration, setOpenedRegistration] = useState(false)

  const submitBtn = useRef<HTMLAnchorElement>(null)

  if (!loaded)
    return (
      <h2>
        <Spinner />
        Loading...
      </h2>
    )

  return (
    <div>
      <h1 className="text-center">{election_title}</h1>
      <div className="max-w-[350px] mx-auto">
        <h2 className="text-center">To cast a vote...</h2>
        {voter_applications_allowed ? (
          <div style={{ textAlign: 'center' }}>
            <OnClickButton
              style={{ margin: 0, marginTop: 20, padding: '10px 15px' }}
              onClick={() => setOpenedVoterAuthInput(!openedVoterAuthInput)}
            >
              Enter your Voter Authorization Token
            </OnClickButton>
          </div>
        ) : (
          <p>Enter your Voter Authorization Token:</p>
        )}

        {openedVoterAuthInput && (
          <>
            <div className="flex items-start mt-6">
              <TextField
                autoFocus
                InputLabelProps={{ style: { fontSize: 22 } }}
                InputProps={{ style: { fontSize: 22 } }}
                error={!!error}
                helperText={error}
                label="Auth token"
                style={{ flex: 1, fontSize: 20 }}
                variant="outlined"
                onChange={(event) => {
                  setError('')

                  try {
                    testAuthToken(event.target.value)
                  } catch (e) {
                    if (typeof e === 'string') return setError(e)
                    setError('Caught error w/o message')
                  }

                  setText(event.target.value)
                }}
                onKeyPress={(event) => event.key === 'Enter' && submitBtn.current?.click()}
              />
              <OnClickButton
                disabled={text.length !== 10 || !!error}
                ref={submitBtn}
                style={{ margin: 0, marginLeft: 10, padding: '19px 15px' }}
                onClick={() => {
                  // Update auth in URL
                  const url = new URL(window.location.toString())
                  url.searchParams.set('auth', text.toLowerCase())
                  router.push(url)
                }}
              >
                Submit
              </OnClickButton>
            </div>
            <p className="opacity-60">
              <i>Example:</i> 22671df063
              <br />
              <br />
              Auth tokens are 10 characters long, made up of the numbers <i>0–9</i> and the letters <i>a–f</i>.
              <br />
              <br />
              Unique for each election.
            </p>
          </>
        )}
      </div>

      <div className="text-center">
        <h2 className="my-12 italic font-medium opacity-70">— &nbsp; or &nbsp; —</h2>

        <OnClickButton
          style={{ margin: 0, padding: '10px 15px' }}
          onClick={() => setOpenedRegistration(!openedRegistration)}
        >
          Enter Your Info To Join Election
        </OnClickButton>
        {!voter_applications_allowed && (
          <p className="italic font-semibold text-rose-700">
            This election is not accepting any more voters at this time.
          </p>
        )}
        {openedRegistration && voter_applications_allowed && <VoterRegistrationForm />}
      </div>
    </div>
  )
}

function testAuthToken(s: string) {
  const validRegEx = /^(\d|[a-f])*$/i
  // Check for invalid characters
  if (!validRegEx.test(s)) {
    const invalids = s.split('').filter((char) => !validRegEx.test(char))
    throw `Invalid character: ${invalids}`
  }

  // Check for too many characters
  if (s.length > 10) throw `Too many characters (by ${s.length - 10})`
}

function useElectionInfo() {
  const { election_id } = useRouter().query
  const [info, setInfo] = useState<ElectionInfo & { loaded: boolean }>({ loaded: false })
  useEffect(() => {
    async function getElectionInfo() {
      const response = await fetch(`/api/election/${election_id}/info`)

      setInfo({ ...(await response.json()), loaded: true })
    }
    if (!election_id) return
    getElectionInfo()
  }, [election_id])
  return info
}
