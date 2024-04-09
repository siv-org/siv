import { TextField, TextFieldProps } from '@mui/material'
import { useCallback, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'
import { Row } from 'src/_shared/Forms/Row'
import { NoSsr } from 'src/_shared/NoSsr'
import { api } from 'src/api-helper'

export const ContactRepForm = () => {
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const formName = 'contactreps'

  // DRY-up TextField
  const Field = useCallback(
    (props: TextFieldProps) => (
      <NoSsr>
        <TextField
          size="small"
          variant="outlined"
          onChange={() => setSaved(false)}
          {...props}
          id={`${formName}-${props.id}`}
          style={{ ...props.style }}
        />
      </NoSsr>
    ),
    [],
  )

  return (
    <form autoComplete="off">
      <Row>
        <Field fullWidth id="name" label="Your Name" />
      </Row>
      <Row>
        <Field fullWidth id="zip" label="Your ZIP Code" />
      </Row>
      <Row>
        <Field fullWidth id="email" label="Your Email (optional)" />
      </Row>
      <Row>
        <Field fullWidth multiline id="message" label="Your Message" rows={4} />
      </Row>
      <Row style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
        {saved && <p style={{ margin: 0, opacity: 0.7, width: 60 }}>Done.</p>}
        <OnClickButton
          disabled={saved}
          style={{ marginRight: 0 }}
          onClick={async () => {
            const fields: Record<string, string> = {}
            setError('')

            // Get data from input fields
            ;['name', 'zip', 'email', 'message'].forEach((field) => {
              fields[field] = (document.getElementById(`${formName}-${field}`) as HTMLInputElement).value
            })

            const response = await api('citizen-forms/contact-reps', fields)
            if (response.ok) return setSaved(true)

            setError((await response.json()).error)
          }}
        >
          Send
        </OnClickButton>
      </Row>
      <p className="error">{error}</p>

      <style jsx>{`
        .error {
          color: red;
          position: relative;
          bottom: 6rem;
        }
      `}</style>
    </form>
  )
}
