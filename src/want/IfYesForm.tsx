import { GlobalOutlined, LinkOutlined } from '@ant-design/icons'
import { TextField, TextFieldProps } from '@mui/material'
import { useCallback, useState } from 'react'
import { Row } from 'src/_shared/Forms/Row'
import { NoSsr } from 'src/_shared/NoSsr'

import { FormSubmitBtns } from './FormSubmitBtns'

export const IfYesForm = ({ id }: { id?: string }) => {
  const [saved, setSaved] = useState(false)
  const [showBottom, setShowBottom] = useState(false)
  // const [error, setError] = useState('')
  const [contentPreferences, setContentPreferences] = useState<Record<string, boolean>>({})
  const [stayUpdated, setStayUpdated] = useState(false)
  const [copied, setCopied] = useState(false)

  // DRY-up TextField
  const Field = useCallback(
    (props: TextFieldProps) => (
      <NoSsr>
        <TextField
          onChange={() => setSaved(false)}
          size="small"
          variant="outlined"
          {...props}
          id={props.id}
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
      <Row style={{ marginBottom: 0 }}>
        <Field fullWidth id="email" label="Your Email" />
      </Row>
      <Row style={{ marginTop: 10 }}>
        <label>
          <input checked={stayUpdated} onClick={() => setStayUpdated(!stayUpdated)} readOnly type="checkbox" />
          Keep me updated
        </label>
      </Row>
      <Row className="location">
        <Field fullWidth id="city" label="City" style={{ marginRight: 30 }} />

        <Field fullWidth id="state" label="State" style={{ marginRight: 30 }} />

        <Field fullWidth id="zip" label="ZIP" style={{ marginRight: 30, maxWidth: 80 }} />

        <Field fullWidth id="country" label="Country" />
      </Row>
      <Row>
        <Field fullWidth id="reason" label="Reason / Note" multiline rows={4} />
      </Row>
      <Row style={{ marginBottom: 0 }}>
        <Field
          fullWidth
          id="topics"
          label="Questions or topics you'd like more information about "
          multiline
          rows={4}
        />
      </Row>
      <div className="content-preference">
        Preference:
        <div>
          {['Video', 'Audio', 'Text'].map((label) => (
            <label key={label}>
              <input
                checked={!!contentPreferences[label]}
                onClick={() => setContentPreferences({ ...contentPreferences, [label]: !contentPreferences[label] })}
                readOnly
                type="checkbox"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <FormSubmitBtns
        fields={{ contentPreferences, id, stayUpdated }}
        formFieldNames={['name', 'email', 'city', 'state', 'country', 'zip', 'reason', 'topics']}
        {...{ saved, setSaved, setShowBottom }}
      />

      {/* Bottom part */}
      {showBottom && (
        <>
          <h2>Thank you for your time!</h2>

          <div className="bottom-content">
            Share this question with your friends
            <br /> More <i>Yes</i> = Faster availability
            <br />
            <div className="icons">
              <a
                onClick={() => {
                  setCopied(true)
                  navigator.clipboard.writeText('https://siv.org/do-you-want-siv')
                }}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <LinkOutlined style={{ fontSize: 25, marginTop: 30 }} />
                <span>Link</span>
                {copied && (
                  <span style={{ bottom: -50, color: 'blue', left: -20, position: 'absolute' }}>
                    Copied to clipboard!
                  </span>
                )}
              </a>
              <a href="/">
                <GlobalOutlined style={{ fontSize: 25, marginTop: 30 }} />
                <span>Homepage</span>
              </a>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .error {
          color: red;
          position: relative;
          bottom: 6rem;
        }
        .content-preference {
          display: flex;
          margin-top: 10px;
          margin-bottom: 1.5rem;
        }
        .content-preference > div {
          display: flex;
        }

        .content-preference label {
          display: flex;
          font-size: 15px;
          align-items: center;
          margin-left: 1.5rem;
        }

        input[type='checkbox'] {
          margin-right: 15px;
          transform: scale(1.2);
        }

        h2 {
          text-align: center;
        }
        .bottom-content {
          text-align: center;
        }
        .icons {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .icons a,
        .icons a span {
          display: block;
          color: darkblue;
        }

        .icons > a:not(:last-child) {
          margin-right: 3rem;
        }
      `}</style>

      <style global jsx>{`
        @media (max-width: 700px) {
          .location {
            flex-direction: column;
          }

          .location > div {
            margin-bottom: 10px;
          }
          .content-preference > div {
            flex-direction: column;
          }
        }
      `}</style>
    </form>
  )
}
