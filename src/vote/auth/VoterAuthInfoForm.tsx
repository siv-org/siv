import { TextField } from '@mui/material'
import { validate as validateEmail } from 'email-validator'
import { useRouter } from 'next/router'
import { RefObject, useRef, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'
import { api } from 'src/api-helper'

const extraAuthInfo = ['1764273267967']

export const VoterAuthInfoForm = () => {
  const [emailError, setEmailError] = useState('')
  const [submissionError, setSubmissionError] = useState('')
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [birthday, setBirthday] = useState('')
  const [statusNumber, setStatusNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const submitBtn = useRef<HTMLAnchorElement>(null)
  const router = useRouter()
  const { election_id, link: link_auth } = router.query as { election_id?: string; link?: string }

  // Turn on additional auth info
  const enableBirthday = extraAuthInfo.includes(election_id || '')
  const enableStatusNumber = extraAuthInfo.includes(election_id || '')
  const enableAdditionalAuthInfo = enableBirthday || enableStatusNumber

  return (
    <section>
      <Row>
        <Item autoFocus label="First Name" setter={setFirstName} />
        <Item label="Last Name" setter={setLastName} />
      </Row>

      <Row>
        <Item
          errorSetter={setEmailError}
          errorString={emailError}
          label="Email (to be verified)"
          onEnter={submitBtn}
          setter={setEmail}
        />
      </Row>

      {enableAdditionalAuthInfo && (
        <Row>
          {enableBirthday && <Item label="Date of Birth (MM/DD/YYYY)" setter={setBirthday} />}
          {enableStatusNumber && <Item label="Voter status number" setter={setStatusNumber} />}
        </Row>
      )}

      <OnClickButton
        className="w-full text-xl text-center"
        disabled={(!first_name && !last_name && !validateEmail(email)) || !!emailError || submitting}
        error={!!submissionError}
        helperText={submissionError}
        onClick={async () => {
          setSubmissionError('')

          // Validate email if present
          if (email && !validateEmail(email)) return setEmailError('Invalid email address')

          // Submit details to server
          setSubmitting(true)

          // We may customize the payload if additionalAuthInfo is enabled
          const payload: Record<string, Record<string, string> | string | undefined> = {
            email,
            first_name,
            last_name,
            link_auth,
          }
          if (enableAdditionalAuthInfo) {
            const additionalAuthInfo: Record<string, string> = {}
            if (enableBirthday) additionalAuthInfo.birthday = birthday
            if (enableStatusNumber) additionalAuthInfo.statusNumber = statusNumber
            payload.additionalAuthInfo = additionalAuthInfo
          }

          const response = await api(`election/${election_id}/submit-link-auth-info`, payload)
          setSubmitting(false)

          // Handle errors from server
          if (!response.ok) {
            const responseJson = await response.json()
            if (!responseJson?.error) {
              console.error('submission responseJson', responseJson)
              return setSubmissionError('Unknown error')
            }
            console.error('submission responseJson.error', responseJson?.error)
            return setSubmissionError(responseJson?.error)
          }

          // Store the email address locally so we can remind them later to check it
          if (email) localStorage.setItem(`registration-${link_auth}`, email)

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

function Item({
  autoFocus,
  errorSetter,
  errorString,
  label,
  onEnter,
  setter,
}: {
  autoFocus?: boolean
  errorSetter?: (v: string) => void
  errorString?: string
  label: string
  onEnter?: RefObject<HTMLAnchorElement>
  setter: (v: string) => void
}) {
  return (
    <TextField
      autoFocus={autoFocus}
      InputLabelProps={{ style: { fontSize: 22 } }}
      InputProps={{ style: { fontSize: 22 } }}
      {...{ label }}
      error={!!errorString}
      helperText={errorString}
      onChange={(event) => {
        errorSetter?.('')
        setter(event.target.value)
      }}
      onKeyDown={(event) => event.key === 'Enter' && onEnter?.current?.click()}
      style={{ flex: 1, fontSize: 20 }}
      variant="outlined"
    />
  )
}

function Row({ children }: { children: React.ReactNode }) {
  const childrenLength = Array.isArray(children) ? children.length : 0

  return (
    <div
      className={`flex flex-col mb-4 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-3 mx-auto ${
        childrenLength > 1 ? '' : 'sm:max-w-md'
      }`}
    >
      {children}
    </div>
  )
}
