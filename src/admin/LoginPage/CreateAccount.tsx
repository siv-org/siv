import { TextField, TextFieldProps } from '@mui/material'
import { validate as validateEmail } from 'email-validator'
import router from 'next/router'
import { useEffect, useState } from 'react'
import { OnClickButton, darkBlue } from 'src/_shared/Button'
import { NoSsr } from 'src/_shared/NoSsr'
import { api } from 'src/api-helper'
import { Row } from 'src/homepage/AreYouAVoter'

import { CreatedAccountWaiting } from './CreatedAccountWaiting'
import { breakpoint } from './LoginPage'

const adminInitKey = 'siv-admin-init'

export const CreateAccount = () => {
  const [submitted, setSubmitted] = useState<string>()

  useEffect(() => {
    attemptInitLoginCode()
  }, [])

  if (submitted) return <CreatedAccountWaiting email={submitted} />

  return (
    <section>
      <h2 onClick={attemptInitLoginCode}>Create an account</h2>
      <p>Approved governments can pilot SIV for free.</p>
      <NoSsr>
        <Row>
          <Field label="First Name" style={{ marginRight: 10 }} />
          <Field label="Last Name" />
        </Row>
        <Row>
          <Field label="Email" />
        </Row>
        <Row>
          <Field label="Your Organization" />
        </Row>
      </NoSsr>
      <div style={{ textAlign: 'right' }}>
        <OnClickButton
          invertColor
          noBorder
          background={darkBlue}
          style={{ margin: 0, padding: '10px 30px' }}
          onClick={async () => {
            const fields: Record<string, string> = { created_at: new Date().toString() }
            ;['first_name', 'last_name', 'email', 'your_organization'].forEach((id) => {
              fields[id] = (document.getElementById(id) as HTMLInputElement).value
            })

            const { email } = fields

            // Validate email on frontend
            if (!validateEmail(email)) return alert('Not a valid email address')

            const response = await api('admin-create-account', fields)

            if (response.status !== 200) return alert((await response.json()).error)

            const code = (await response.json()).init_login_code

            localStorage.setItem(adminInitKey, JSON.stringify({ code, email }))

            setSubmitted(email)
          }}
        >
          Create Account
        </OnClickButton>
      </div>
      <style jsx>{`
        section {
          position: relative;
          bottom: 41px;
        }

        h2 {
          font-size: 30px;
          font-weight: 600;
        }

        @media (max-width: 799px) {
          section {
            bottom: 39px;
          }
        }

        @media (max-width: ${breakpoint}px) {
          section {
            bottom: 0;
            padding-bottom: 3rem;
          }

          h2 {
            margin-top: 0;
            font-size: 24px;
          }
        }
      `}</style>
    </section>
  )
}

const Field = (props: TextFieldProps & { label: string }) => (
  <TextField
    fullWidth
    id={props.label.toLowerCase().replace(' ', '_')}
    size="small"
    variant="outlined"
    {...props}
    style={{ background: 'white', ...props.style }}
  />
)

export async function attemptInitLoginCode() {
  const initCode = localStorage.getItem(adminInitKey)
  if (!initCode) return
  // Check w/ API if it can now be used to log in
  const response = await api('admin-use-init-code', JSON.parse(initCode))

  if (response.status === 400) return console.error(await response.json())

  // Unapproved
  if (response.status === 204) return

  // Clear localStorage key
  localStorage.removeItem(adminInitKey)

  // Approved & can skip_init_verification
  if (response.status === 200) return await router.push('./admin')
}
