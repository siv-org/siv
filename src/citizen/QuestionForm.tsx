import { TextField, TextFieldProps } from '@mui/material'
import { useCallback, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'
import { Row } from 'src/_shared/Forms/Row'
import { NoSsr } from 'src/_shared/NoSsr'
import { api } from 'src/api-helper'

export const QuestionForm = () => {
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const formName = 'investmentquestion'

  // DRY-up TextField
  const Field = useCallback(
    (props: TextFieldProps) => (
      <NoSsr>
        <TextField
          onChange={() => setSaved(false)}
          size="small"
          variant="outlined"
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
        <Field fullWidth id="name" label="Your Name (optional)" />
      </Row>
      <Row>
        <Field fullWidth id="email" label="Your Email (optional — for replies)" />
      </Row>
      <Row>
        <Field fullWidth id="question" label="Your Question" multiline rows={4} />
      </Row>
      <Row style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
        {saved && <p style={{ margin: 0, opacity: 0.7, width: 60 }}>Done.</p>}
        <OnClickButton
          disabled={saved}
          onClick={async () => {
            const fields: Record<string, string> = {}
            setError('')

            // Get data from input fields
            ;['name', 'email', 'question'].forEach((field) => {
              fields[field] = (document.getElementById(`${formName}-${field}`) as HTMLInputElement).value
            })

            const response = await api('citizen-forms/question', fields)
            if (response.ok) return setSaved(true)

            setError((await response.json()).error)
          }}
          style={{ marginRight: 0 }}
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
