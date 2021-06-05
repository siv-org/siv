const darkBlue = '#002868'

import { BoxProps, NoSsr, TextField, TextFieldProps } from '@material-ui/core'
import { firestore } from 'firebase/app'
import { omit } from 'lodash-es'
import { useState } from 'react'
import { Element } from 'react-scroll'

import { api } from '../api-helper'
import { OnClickButton } from '../landing-page/Button'

export function GiveYourVoters({ idKey }: { idKey: string }): JSX.Element {
  const [saved, setSaved] = useState(false)

  // We'll reset 'saved' state if they try to edit the textfields again
  const onChange = () => setSaved(false)

  // Differentiate this form among multiple instances on the page
  const toID = (field: string) => `${field}-${idKey}`

  const fieldProps = { onChange, toID }

  return (
    <div className="container">
      <div className="column">
        <a id="give-your-voters" />
        <Element name="give-your-voters" />
        <h3 style={{ color: darkBlue, margin: '1.5rem 0' }}>Give your voters the future of democracy</h3>

        <p>Join the many local jurisdictions already interested.</p>
        <p>Fill out the following information and we&apos;ll get back to you as soon as possible.</p>
      </div>

      <form autoComplete="off" className="column">
        <Row>
          <Field id="name" label="Your Name" {...fieldProps} />
        </Row>
        <Row>
          <Field label="Email" {...fieldProps} style={{ marginRight: 10 }} />
          <Field id="phone" label="Phone Number" {...fieldProps} />
        </Row>
        <Row>
          <Field label="Location" {...fieldProps} style={{ marginRight: 10 }} />
          <Field id="num-voters" label="# Voters" {...fieldProps} style={{ maxWidth: 100 }} />
        </Row>
        <Row>
          <Field multiline id="message" label="Message (optional)" rows={5} {...fieldProps} />
        </Row>
        <Row style={{ justifyContent: 'flex-end' }}>
          {saved && <p style={{ margin: 0, opacity: 0.7, width: 60 }}>Done.</p>}
          <OnClickButton
            disabled={saved}
            style={{ marginRight: 0 }}
            onClick={() => {
              const fields: Record<string, string | Date> = { created_at: new Date().toString(), idKey }

              // Get data from input fields
              ;['name', 'email', 'phone', 'location', 'num-voters', 'message'].forEach((field) => {
                fields[field] = (document.getElementById(toID(field)) as HTMLInputElement).value
              })

              // Store submission in Firestore
              firestore()
                .collection('jurisdictions-leads')
                .doc(new Date().toISOString() + ' ' + String(Math.random()).slice(2, 7))
                .set(fields)
                .then(() => {
                  setSaved(true)

                  // Notify via Pushover
                  api('pushover', {
                    message: `${fields.email}\n\n${fields.message}`,
                    title: `SIV jurisdiction-lead: ${fields.name} (${fields.location})`,
                  })
                })
            }}
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

        /* Small screens: single column */
        @media (max-width: 750px) {
          .container {
            padding: 17px 6vw;
            flex-direction: column;
          }

          .column:first-child {
            margin: 0;
          }
        }

        /* Large screens: increase horiz padding */
        @media (min-width: 1050px) {
          .container {
            padding: 3rem 5rem;
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
      fullWidth
      id={props.toID(props.id || (props.label as string).toLowerCase())}
      size="small"
      variant="outlined"
      {...omit(props, ['toID', 'id'])}
      style={{ ...props.style }}
    />
  </NoSsr>
)
