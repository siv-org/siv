import { Button, Paper, TextField, TextFieldProps } from '@material-ui/core'
import { DetailedHTMLProps, HTMLAttributes } from 'react'

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
          <Field label="Name" />
          <Field label="ZIP" />
        </Row>
        <Row>
          <Field label="Email" />
        </Row>
        <Row>
          <Field fullWidth label="Comment" multiline rows={4} />
        </Row>
        <Button color="primary" style={{ float: 'right', marginBottom: 30 }} variant="contained">
          Submit
        </Button>
      </form>
    </Paper>
  )
}

const Row = (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
  <div style={{ margin: '1.5rem 0', ...props.style }} {...props} />
)

const Field = (props: TextFieldProps) => (
  <TextField
    // InputLabelProps={{ shrink: true }}
    id={(props.label as string).toLowerCase()}
    size="small"
    variant="outlined"
    {...props}
    style={{ backgroundColor: '#fff8' }}
  />
)
