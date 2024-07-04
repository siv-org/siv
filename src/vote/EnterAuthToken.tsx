import { TextField } from '@mui/material'
import router from 'next/router'
import { useRef, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'

export const EnterAuthToken = () => {
  const [error, setError] = useState('')
  const [text, setText] = useState('')
  const submitBtn = useRef<HTMLAnchorElement>(null)
  return (
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
