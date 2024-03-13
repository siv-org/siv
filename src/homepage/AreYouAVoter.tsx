import { BoxProps, NoSsr, TextField, TextFieldProps } from '@mui/material'
import { omit } from 'lodash-es'
import { useState } from 'react'
import { Element } from 'react-scroll'

import { OnClickButton } from '../_shared/Button'
import { api } from '../api-helper'
import { darkBlue } from './colors'

export function AreYouAVoter(): JSX.Element {
  const idKey = 'home3'
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // We'll reset 'saved' state if they try to edit the textfields again
  const onChange = () => setSaved(false)

  // Differentiate this form among multiple instances on the page
  const toID = (field: string) => `${field}-${idKey}`

  const fieldProps = { onChange, toID }

  return (
    <div className="are-you-container">
      <div className="column">
        <a id="let-your-govt-know" />
        <Element name="let-your-govt-know" />
        <h2>Are you a voter?</h2>
        <h3>Let your local government know you want Secure Internet Voting</h3>
      </div>

      <form autoComplete="off" className="column">
        <Row>
          <Field id="name" label="Your Name" {...fieldProps} style={{ flex: 1, marginRight: 30 }} />
          <Field label="ZIP" {...fieldProps} style={{ maxWidth: 80 }} />
        </Row>
        <Row>
          <Field fullWidth id="email" label="Your Email (optional)" {...fieldProps} />
        </Row>
        <Row>
          <Field fullWidth multiline id="message" label="Your Message (optional)" rows={4} {...fieldProps} />
        </Row>
        <Row style={{ justifyContent: 'flex-end' }}>
          {saved && <p style={{ margin: 0, opacity: 0.7, width: 60 }}>Done.</p>}
          <OnClickButton
            disabled={saved}
            style={{ marginRight: 0 }}
            onClick={async () => {
              const fields: Record<string, string> = { idKey }
              setError('')

              // Get data from input fields
              ;['name', 'zip', 'email', 'message'].forEach((field) => {
                fields[field] = (document.getElementById(toID(field)) as HTMLInputElement).value
              })

              const response = await api('let-your-govt-know', fields)
              if (response.ok) return setSaved(true)

              setError((await response.json()).error)
            }}
          >
            Send
          </OnClickButton>
        </Row>
        <p className="error">{error}</p>
      </form>

      <style jsx>{`
        .are-you-container {
          margin-top: 13vw;
          display: flex;
        }

        .column {
          flex: 1;
        }

        .column:first-child {
          margin-right: 9%;
        }

        h2 {
          margin-top: 2vw;
          font-size: 3.5vw;
          font-weight: 800;
        }

        h3 {
          font-size: 2.25vw;
          color: ${darkBlue};
          margin: 3vw 0;
        }

        .error {
          color: red;
          position: relative;
          bottom: 6rem;
        }

        /* Small screens: single column */
        @media (max-width: 700px) {
          .are-you-container {
            flex-direction: column;
          }

          .column:first-child {
            margin: 0;
          }

          h2 {
            font-size: 6vw;
          }

          h3 {
            font-size: 4.5vw;
          }
        }

        /* fixed width for large screens */
        @media (min-width: 1440px) {
          .are-you-container {
            max-width: 1440px;
            margin: 0 auto;

            padding-top: 15rem;
          }

          .column:first-child {
            bottom: 1.8rem;
            position: relative;
          }
        }
      `}</style>
    </div>
  )
}

const Row = (props: BoxProps) => (
  <div
    {...props}
    style={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: '1.5rem 0',
      ...props.style,
    }}
  />
)

// DRY-up TextField
const Field = (props: TextFieldProps & { toID: (f: string) => string }) => (
  <NoSsr>
    <TextField
      id={props.toID(props.id || (props.label as string).toLowerCase())}
      size="small"
      variant="outlined"
      {...omit(props, ['toID', 'id'])}
      style={{ ...props.style }}
    />
  </NoSsr>
)
