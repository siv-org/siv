import { BoxProps, NoSsr, TextField, TextFieldProps } from '@material-ui/core'
import { useCallback, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'
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
        <Field fullWidth id="name" label="Your Name (optional)" />
      </Row>
      <Row>
        <Field fullWidth id="email" label="Your Email (optional - if you want a reply)" />
      </Row>
      <Row>
        <Field fullWidth multiline id="question" label="Your Question" rows={4} />
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
            ;['name', 'email', 'question'].forEach((field) => {
              fields[field] = (document.getElementById(`${formName}-${field}`) as HTMLInputElement).value
            })

            const response = await api('citizen-forms/question', fields)
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

const Row = (props: BoxProps) => (
  <div
    {...props}
    style={{
      display: 'flex',
      margin: '1.5rem 0',
      ...props.style,
    }}
  />
)
