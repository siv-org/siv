import { BoxProps, Button, Paper, TextField, TextFieldProps } from '@material-ui/core'
import { firestore } from 'firebase'
import { useState } from 'react'

export default function CallToAction(): JSX.Element {
  const [saved, setSaved] = useState(false)

  return (
    <Paper
      elevation={5}
      style={{
        backgroundColor: 'rgb(220, 235, 245)',
        border: '1px solid rgba(0, 11, 128, 0.1)',
        margin: '2rem 0.5rem',
        padding: '0 2rem',
      }}
    >
      <h4 style={{ margin: '1.5rem 0', textAlign: 'center' }}>
        Let your government officials know you want them to investigate Secure Internet Voting
      </h4>

      <p style={{ color: '#555', fontSize: 13, textAlign: 'center' }}>
        We’ll send them a message so they know more of their constituents are interested.
      </p>

      <style global jsx>{`
        .MuiInputLabel-shrink {
          background-color: rgb(235, 246, 254);
        }
      `}</style>
      <form autoComplete="off">
        <Row>
          <Field id="name" label="Your Name" s={setSaved} style={{ flex: 1, marginRight: 30 }} />
          <Field label="ZIP" s={setSaved} style={{ maxWidth: 80 }} />
        </Row>
        <Row>
          <Field fullWidth label="Email" s={setSaved} />
        </Row>
        <Row>
          <Field fullWidth label="Comment" multiline rows={4} s={setSaved} />
        </Row>
        <Row style={{ justifyContent: 'flex-end' }}>
          {saved && <p style={{ margin: 0, opacity: 0.7, width: 60 }}>Saved.</p>}
          <Button
            color="primary"
            disabled={saved}
            onClick={() => {
              const fields: Record<string, string | Date> = { created_at: new Date().toString() }

              // Get data from input fields
              ;['name', 'zip', 'email', 'comment'].forEach((id) => {
                fields[id] = (document.getElementById(id) as HTMLInputElement).value
              })

              firestore()
                .collection('endorsers')
                .doc(new Date().toISOString() + ' ' + String(Math.random()).slice(2, 7))
                .set(fields)
                .then(() => setSaved(true))
            }}
            variant="contained"
          >
            Submit
          </Button>
        </Row>
      </form>
    </Paper>
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
const Field = (props: TextFieldProps & { s: (saved: boolean) => void }) => (
  <TextField
    id={props.id || (props.label as string).toLowerCase()}
    size="small"
    variant="outlined"
    {...props}
    onChange={() => props.s(false)}
    style={{ backgroundColor: '#fff8', ...props.style }}
  />
)
