import { TextField } from '@material-ui/core'
import { useRef, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'

export const VoterRegistrationForm = () => {
  const [error, setError] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const submitBtn = useRef<HTMLAnchorElement>(null)

  return (
    <section className="text-lg">
      <p>Please provide your identifying information, then you can cast your vote.</p>
      <div className="flex flex-col mb-4 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-3 row">
        <TextField
          autoFocus
          InputLabelProps={{ style: { fontSize: 22 } }}
          InputProps={{ style: { fontSize: 22 } }}
          error={!!error}
          helperText={error}
          label="First Name"
          style={{ flex: 1, fontSize: 20 }}
          variant="outlined"
          onChange={(event) => {
            setError('')

            setFirstName(event.target.value)
          }}
        />
        <TextField
          InputLabelProps={{ style: { fontSize: 22 } }}
          InputProps={{ style: { fontSize: 22 } }}
          error={!!error}
          helperText={error}
          label="Last Name"
          style={{ flex: 1, fontSize: 20 }}
          variant="outlined"
          onChange={(event) => {
            setError('')

            setLastName(event.target.value)
          }}
        />
      </div>
      <div className="flex mx-auto mb-4 sm:max-w-md">
        <TextField
          InputLabelProps={{ style: { fontSize: 22 } }}
          InputProps={{ style: { fontSize: 22 } }}
          error={!!error}
          helperText={error}
          label="Email (to be verified)"
          style={{ flex: 1, fontSize: 20 }}
          variant="outlined"
          onChange={(event) => {
            setError('')

            setEmail(event.target.value)
          }}
          onKeyPress={(event) => event.key === 'Enter' && submitBtn.current?.click()}
        />
      </div>
      <OnClickButton
        disabled={!firstName || !lastName || !email || !!error}
        ref={submitBtn}
        style={{ margin: 0, padding: '19px 15px' }}
        onClick={() => {
          // Update auth in URL
          // const url = new URL(window.location.toString())
          // url.searchParams.set('auth', text.toLowerCase())
          // router.push(url)
        }}
      >
        Continue to Vote
      </OnClickButton>
    </section>
  )
}
