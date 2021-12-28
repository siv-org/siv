import { BoxProps, NoSsr, TextField, TextFieldProps } from '@material-ui/core'
import { omit } from 'lodash-es'
import { useState } from 'react'
import { Element } from 'react-scroll'

import { api } from '../api-helper'
import { OnClickButton } from '../landing-page/Button'
import { darkBlue } from './colors'

export function AreYouAVoter(): JSX.Element {
  const idKey = 'home3'
  const [saved, setSaved] = useState(false)

  // We'll reset 'saved' state if they try to edit the textfields again
  const onChange = () => setSaved(false)

  // Differentiate this form among multiple instances on the page
  const toID = (field: string) => `${field}-${idKey}`

  const fieldProps = { onChange, toID }

  return (
    <div className="container">
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
              const fields: Record<string, string | Date> = { idKey }

              // Get data from input fields
              ;['name', 'zip', 'email', 'message'].forEach((field) => {
                fields[field] = (document.getElementById(toID(field)) as HTMLInputElement).value
              })

              const { status } = await api('/let-your-govt-know', fields)
              if (status === 201) setSaved(true)
            }}
          >
            Send
          </OnClickButton>
        </Row>
      </form>

      <style jsx>{`
        .container {
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

        /* Small screens: single column */
        @media (max-width: 750px) {
          .container {
            flex-direction: column;
          }

          .column:first-child {
            margin: 0;
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
