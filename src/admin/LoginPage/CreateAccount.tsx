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
          noBorder
          background={darkBlue}
          style={{ margin: 0, padding: '10px 30px' }}
          onClick={() => {
            const data: Record<string, string> = {}
            ;['first-name', 'last-name', 'email', 'your-organization'].forEach((id) => {
              data[id] = (document.getElementById(id) as HTMLInputElement).value
            })
            alert(JSON.stringify(data))
          }}
        >
          Create Account
        </OnClickButton>
      </div>
      <style jsx>{`
        section {
          position: relative;
          bottom: 39px;
        }

        h2 {
          font-size: 30px;
          font-weight: 600;
        }

        @media (max-width: 799px) {
          section {
            bottom: 51px;
          }
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

const Field = (props: TextFieldProps & { label: string }) => (
  <TextField
    fullWidth
    id={props.label.toLowerCase().replace(' ', '-')}
    size="small"
    variant="outlined"
    {...props}
    style={{ background: 'white', ...props.style }}
  />
)
