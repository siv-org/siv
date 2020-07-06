import { BoxProps, Button, Paper, TextField, TextFieldProps } from '@material-ui/core'
import { firestore } from 'firebase'

export default function CallToAction(): JSX.Element {
  return (
    <Paper
      elevation={5}
      style={{
        backgroundColor: 'rgb(220, 235, 245)',
        border: '1px solid rgba(0, 11, 128, 0.1)',
        margin: '2rem 2rem',
        padding: '0 2rem',
      }}
    >
      <h4 style={{ margin: '1.5rem 0', textAlign: 'center' }}>
        Let your government officials know you want them to investigate Secure Internet Voting
      </h4>

      <p style={{ color: '#555', fontSize: 13, textAlign: 'center' }}>
        We’ll send them a message so they know more of their constituents are interested.
      </p>

      <form>
        <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Field label="Name" style={{ flex: 1, marginRight: 30 }} />
          <Field label="ZIP" style={{ maxWidth: 80 }} />
        </Row>
        <Row>
          <Field fullWidth label="Email" />
        </Row>
        <Row>
          <Field fullWidth label="Comment" multiline rows={4} />
        </Row>
        <Button
          color="primary"
          onClick={() => {
            const fields: Record<string, string | Date> = { created_at: new Date().toString() }

            ;['name', 'zip', 'email', 'comment'].forEach((id) => {
              fields[id] = (document.getElementById(id) as HTMLInputElement).value
            })

            firestore()
              .collection('endorsers')
              .doc(new Date().toISOString() + ' ' + String(Math.random()))
              .set(fields)
          }}
          style={{ float: 'right', marginBottom: 30 }}
          variant="contained"
        >
          Submit
        </Button>
      </form>
    </Paper>
  )
}

const Row = (props: BoxProps) => <div style={{ margin: '1.5rem 0', ...props.style }} {...props} />

const Field = (props: TextFieldProps) => (
  <TextField
    id={(props.label as string).toLowerCase()}
    size="small"
    variant="outlined"
    {...props}
    style={{ backgroundColor: '#fff8', ...props.style }}
  />
)
