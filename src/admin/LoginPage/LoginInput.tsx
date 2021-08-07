import { TextField } from '@material-ui/core'
import { validate as validateEmail } from 'email-validator'
import { ChangeEventHandler, KeyboardEventHandler, useRef, useState } from 'react'
import { OnClickButton } from 'src/landing-page/Button'

type SharedInputProps = {
  onChange: ChangeEventHandler<HTMLInputElement>
  onKeyPress: KeyboardEventHandler<HTMLInputElement>
  value: string
}

export const LoginInput = ({ mobile }: { mobile?: boolean }) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const loginButton = useRef<HTMLAnchorElement>(null)
  const Input = mobile ? MUIInput : PlainInput

  return (
    <>
      <label className={`error ${mobile ? 'mobile' : 'desktop'}`} style={{ opacity: error ? '' : 0 }}>
        ⚠️&nbsp; {error}
      </label>
      <div>
        <Input
          value={email}
          onChange={({ target }) => {
            setEmail(target.value)
            setError('')
          }}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              loginButton.current?.click()
            }
          }}
        />
        <OnClickButton
          invertColor={!mobile}
          ref={loginButton}
          style={{ margin: 0, padding: `${mobile ? 7 : 6}px 15px`, whiteSpace: 'nowrap' }}
          onClick={() => {
            if (!validateEmail(email)) return setError('Not a valid email address')
            alert(email)
          }}
        >
          {!error ? 'Send Code' : 'Error!'}
        </OnClickButton>
      </div>
      <style jsx>{`
        div {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .error {
          color: red;
          opacity: 0.7;
          font-size: 12px;
          font-weight: 700;

          border: 1px solid #f00a;
          padding: 5px;
          border-radius: 5px;

          position: absolute;
        }

        .error.desktop {
          bottom: -35px;
        }

        .error.mobile {
          top: -40px;
        }
      `}</style>
    </>
  )
}

const label = 'Login Email'

const PlainInput = (props: SharedInputProps) => (
  <>
    <input placeholder={label} {...props} />
    <style jsx>{`
      input {
        padding: 9px 15px;
        font-size: 16px;
        flex-grow: 1;
        border-radius: 4px;
        border: 0;
        outline-width: 0;
        width: 50px;
        margin-right: 10px;
      }
    `}</style>
  </>
)
const MUIInput = (props: SharedInputProps) => (
  <TextField
    fullWidth
    label={label}
    size="small"
    style={{ backgroundColor: '#fff', marginRight: 10 }}
    variant="outlined"
    {...props}
  />
)
