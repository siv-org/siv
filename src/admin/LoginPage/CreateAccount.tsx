import { BoxProps, NoSsr, TextField, TextFieldProps } from '@material-ui/core'
import { OnClickButton, darkBlue } from 'src/landing-page/Button'

export const CreateAccount = () => {
  return (
    <section>
      <h2>Create an account</h2>
      <p>
        Approved governments get free usage through Dec 31<sup>st</sup>, &apos;21
      </p>
      <NoSsr>
        <Row>
          <Field label="First Name" style={{ marginRight: 10 }} />
          <Field label="Last Name" />
        </Row>
        <Row>
          <Field label="Email" />
        </Row>
        <Row>
          <Field label="Your Organization" />
        </Row>
      </NoSsr>
      <div style={{ textAlign: 'right' }}>
        <OnClickButton
          invertColor
          background={darkBlue}
          style={{ margin: 0, padding: '10px 30px' }}
          onClick={() => {
            alert('TODO')
          }}
        >
          Create Account
        </OnClickButton>
      </div>
      <style jsx>{`
        h2 {
          font-size: 30px;
          font-weight: 600;
        }
      `}</style>
    </section>
  )
}

const Row = (props: BoxProps) => (
  <div
    style={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: '1.5rem 0',
    }}
  >
    {props.children}
  </div>
)

const Field = (props: TextFieldProps) => (
  <TextField fullWidth size="small" variant="outlined" {...props} style={{ background: 'white', ...props.style }} />
)
