import { BoxProps, NoSsr, TextField, TextFieldProps } from '@material-ui/core'
import { validate as validateEmail } from 'email-validator'
import { useState } from 'react'
import { api } from 'src/api-helper'
import { OnClickButton, darkBlue } from 'src/landing-page/Button'

import { CreatedAccountWaiting } from './CreatedAccountWaiting'
import { breakpoint } from './LoginPage'

export const CreateAccount = () => {
  const [submitted, setSubmitted] = useState(false)
  if (submitted) return <CreatedAccountWaiting />

  return (
    <section>
      <h2>Create an account</h2>
      <p>
        Approved governments get free usage through Dec 31<sup>st</sup>, &apos;21
      </p>
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

            // Validate email on frontend
            if (!validateEmail(fields.email)) return alert('Not a valid email address')

            const response = await api('admin-create-account', fields)

            if (response.status !== 200) return alert((await response.json()).error)

            setSubmitted(true)
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

const Row = (props: BoxProps) => (
  <div
    style={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: '1.5rem 0',
    }}
  >
    {props.children}
  </div>
)

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
