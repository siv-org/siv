import { TextField } from '@mui/material'
import { validate as validateEmail } from 'email-validator'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'
import { api } from 'src/api-helper'

export const VoterAuthInfoForm = () => {
  const [error, setError] = useState('')
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const submitBtn = useRef<HTMLAnchorElement>(null)
  const router = useRouter()
  const { election_id, link: link_auth } = router.query as { election_id?: string; link?: string }

  return (
    <section>
      <div className="flex flex-col mb-4 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-3 row">
        <TextField
          autoFocus
          InputLabelProps={{ style: { fontSize: 22 } }}
          InputProps={{ style: { fontSize: 22 } }}
          label="First Name"
          onChange={(event) => setFirstName(event.target.value)}
          style={{ flex: 1, fontSize: 20 }}
          variant="outlined"
        />
        <TextField
          InputLabelProps={{ style: { fontSize: 22 } }}
          InputProps={{ style: { fontSize: 22 } }}
          label="Last Name"
          onChange={(event) => setLastName(event.target.value)}
          style={{ flex: 1, fontSize: 20 }}
          variant="outlined"
        />
      </div>
      <div className="flex mx-auto mb-4 sm:max-w-md">
        <TextField
          error={!!error}
          helperText={error}
          InputLabelProps={{ style: { fontSize: 22 } }}
          InputProps={{ style: { fontSize: 22 } }}
          label="Email (to be verified)"
          onChange={(event) => {
            setError('')
            setEmail(event.target.value)
          }}
          onKeyDown={(event) => event.key === 'Enter' && submitBtn.current?.click()}
          style={{ flex: 1, fontSize: 20 }}
          variant="outlined"
        />
      </div>

      <OnClickButton
        className="w-full text-xl text-center"
        disabled={!first_name || !last_name || !validateEmail(email) || !!error || submitting}
        onClick={async () => {
          // Validate email
          if (!validateEmail(email)) return setError('Invalid email address')

          setSubmitting(true)

          // Submit details to server
          const response = await api(`election/${election_id}/submit-link-auth-info`, {
            email,
            first_name,
            last_name,
            link_auth,
          })
          setSubmitting(false)

          if (!response.ok) return setError((await response.json()).error)

          // Store the email address so we can remind them later to check it
          localStorage.setItem(`registration-${link_auth}`, email)

          // Redirect back to submission screen
          router.push(`${window.location.origin}/election/${election_id}/vote?auth=link&link_auth=${link_auth}`)
        }}
        ref={submitBtn}
        style={{ margin: 0, padding: '19px 15px' }}
      >
        <>Submit{submitting ? 'ting...' : ''}</>
      </OnClickButton>
    </section>
  )
}
