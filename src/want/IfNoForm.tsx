import { BoxProps, NoSsr, TextField, TextFieldProps } from '@material-ui/core'
import { useCallback, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'
import { api } from 'src/api-helper'

export const IfNoForm = () => {
  const [saved, setSaved] = useState(false)
  const [showBottom, setShowBottom] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const formName = 'ifyesform'

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
        <Field fullWidth multiline id="reason" label="What is the reason/concern?" rows={4} />
      </Row>
      <Row style={{ marginBottom: 15 }} />

      <Row>
        <Field fullWidth id="email" label="Your Email (if you'd like a reply)" />
      </Row>
      <Row style={{ marginTop: 10 }}>
        <label onClick={() => void 0}>
          <input id={`${formName}-stay-updated`} type="checkbox" />
          Keep me updated
        </label>
      </Row>

      <OnClickButton
        style={{ marginLeft: 0 }}
        onClick={async () => {
          setError('')
          const response = await api('citizen-forms/do-you-want-siv', { skipped: true })
          if (response.ok) return setSaved(true)
        }}
      >
        Skip
      </OnClickButton>

      <OnClickButton
        disabled={saved}
        style={{ marginRight: 0 }}
        onClick={async () => {
          const fields: Record<string, string | boolean> = selected
          setError('')

          // Get data from input fields
          ;['reason', 'email', 'stay-updated'].forEach((field) => {
            fields[field] = (document.getElementById(`${formName}-${field}`) as HTMLInputElement).value
          })

          const response = await api('citizen-forms/do-you-want-siv', fields)
          if (response.ok) return setSaved(true)
        }}
      >
        Submit
      </OnClickButton>

      {/* Bottom part */}
      {showBottom && (
        <>
          <h2>Thank you for your time!</h2>

          <p className="learnmore-text">
            <i>Learn more:</i>
          </p>
          <div className="learnmore">
            <p>
              <a href="https://siv.org/">Homepage</a>
            </p>
            <p>
              <a href="https://siv.org/protocol">SIV Protocol</a>
            </p>
            <p>
              <a href="https://siv.org/faq">FAQ</a>
            </p>
            <p>
              <a href="https://blog.siv.org/2022/04/top-internet-voting-concerns">Solutions to Top Concerns</a>
            </p>
          </div>
        </>
      )}

      <style jsx>{`
        .error {
          color: red;
          position: relative;
          bottom: 6rem;
        }

        h2 {
          text-align: center;
        }
        p {
          text-align: center;
        }
        .learnmore-text {
          color: grey;
          opacity: 70%;
        }
        .learnmore {
          display: flex;
          justify-content: space-around;
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
