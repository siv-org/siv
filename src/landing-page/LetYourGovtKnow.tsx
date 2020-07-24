const darkBlue = '#002868'

import { BoxProps, TextField, TextFieldProps } from '@material-ui/core'
import { firestore } from 'firebase/app'
import { useState } from 'react'

import { OnClickButton } from './Button'

export function LetYourGovtKnow(): JSX.Element {
  const [saved, setSaved] = useState(false)

  // We'll reset 'saved' state if they try to edit the textfields again
  const onChange = () => setSaved(false)

  return (
    <div className="container">
      <div className="column">
        <h3 style={{ color: darkBlue, margin: '1.5rem 0' }}>
          Let your government officials know you want Secure Internet Voting
        </h3>

        <p>We’ll send them a message so they know more of their constituents are interested.</p>
      </div>

      <form autoComplete="off" className="column">
        <Row>
          <Field id="name" label="Your Name" {...{ onChange }} style={{ flex: 1, marginRight: 30 }} />
          <Field label="ZIP" {...{ onChange }} style={{ maxWidth: 80 }} />
        </Row>
        <Row>
          <Field fullWidth label="Email" {...{ onChange }} />
        </Row>
        <Row>
          <Field fullWidth multiline label="Message" rows={4} {...{ onChange }} />
        </Row>
        <Row style={{ justifyContent: 'flex-end' }}>
          {saved && <p style={{ margin: 0, opacity: 0.7, width: 60 }}>Done.</p>}
          <OnClickButton
            disabled={saved}
            onClick={() => {
              const fields: Record<string, string | Date> = { created_at: new Date().toString() }

              // Get data from input fields
              ;['name', 'zip', 'email', 'message'].forEach((id) => {
                fields[id] = (document.getElementById(id) as HTMLInputElement).value
              })

              // Store submission in Firestore
              firestore()
                .collection('endorsers')
                .doc(new Date().toISOString() + ' ' + String(Math.random()).slice(2, 7))
                .set(fields)
                .then(() => {
                  setSaved(true)

                  // Notify via Pushover
                  fetch('/api/pushover', {
                    body: JSON.stringify({
                      message: `${fields.email}\n\n${fields.message}`,
                      title: `SIV: ${fields.name} (${fields.zip})`,
                    }),
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    method: 'POST',
                  })
                })
            }}
            style={{ marginRight: 0 }}
          >
            Send
          </OnClickButton>
        </Row>
      </form>

      <style jsx>{`
        .container {
          padding: 3rem;
          display: flex;
        }

        .column {
          flex: 1;
        }

        .column:first-child {
          margin-right: 9%;
        }

        /* Small screens: reduce horiz padding */
        @media (max-width: 750px) {
          .container {
            padding: 17px 6vw;
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
const Field = (props: TextFieldProps) => (
  <TextField
    id={props.id || (props.label as string).toLowerCase()}
    size="small"
    variant="outlined"
    {...props}
    style={{ ...props.style }}
  />
)
