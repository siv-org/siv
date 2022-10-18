import { TextField } from '@material-ui/core'
import router from 'next/router'
import { useRef, useState } from 'react'

import { OnClickButton } from '../_shared/Button'
import { VoterRegistrationForm } from './VoterRegistrationForm'

const voter_applications_allowed = true

export const EnterAuthToken = () => {
  const [error, setError] = useState('')
  const [text, setText] = useState('')
  const [openedVoterAuthInput, setOpenedVoterAuthInput] = useState(!voter_applications_allowed)
  const [openedRegistration, setOpenedRegistration] = useState(false)

  const submitBtn = useRef<HTMLAnchorElement>(null)

  return (
    <div className="container">
      <h1>To cast a vote...</h1>
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
          <div className="row" style={{ marginTop: 25 }}>
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
                  if (typeof e === 'string') setError(e)
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
          <p className="grey">
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

      {voter_applications_allowed && (
        <div className="application">
          <h2>—————— &nbsp; or &nbsp; ——————</h2>
          <OnClickButton
            style={{ margin: 0, padding: '10px 15px' }}
            onClick={() => setOpenedRegistration(!openedRegistration)}
          >
            Apply to Join This Election
          </OnClickButton>
          {openedRegistration && <VoterRegistrationForm />}
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 350px;
          margin: 0 auto;
        }

        .row {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
        }

        .grey {
          opacity: 0.6;
        }

        .application {
          text-align: center;
        }

        h2 {
          margin: 30px 0;
          font-weight: 500;
          letter-spacing: -1px;
          font-style: italic;
          opacity: 0.7;
        }
      `}</style>
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
