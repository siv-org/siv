import { TextField } from '@material-ui/core'
import { validate as validateEmail } from 'email-validator'
import { useRouter } from 'next/router'
import { ChangeEventHandler, KeyboardEventHandler, useRef, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'
import { api } from 'src/api-helper'

import { Spinner } from '../Spinner'

type SharedInputProps = {
  onChange: ChangeEventHandler<HTMLInputElement>
  onKeyPress: KeyboardEventHandler<HTMLInputElement>
  value: string
}

export const LoginInput = ({ mobile }: { mobile?: boolean }) => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
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
          onKeyPress={(event) => event.key === 'Enter' && loginButton.current?.click()}
        />
        <OnClickButton
          invertColor={!mobile}
          ref={loginButton}
          style={{
            margin: 0,
            padding: `${mobile ? 7 : 6}px 15px`,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            width: 110,
          }}
          onClick={async () => {
            if (!email) return

            // Validate email on frontend
            if (!validateEmail(email)) return setError('Not a valid email address')

            // Send login request to backend
            setPending(true)
            const response = await api('admin-login', { email })
            setPending(false)

            if (response.status === 400) {
              setError('Invalid email address')
            } else if (response.status === 404) {
              setError('Not an approved account. \nCheck for typos, or Create Account below.')
            } else {
              router.push(`./enter-login-code?email=${email}`)
            }
          }}
        >
          {error ? 'Error!' : pending ? <Spinner /> : 'Send Code'}
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

          white-space: pre-wrap;
        }

        .error.desktop {
          bottom: -${error.includes('\n') ? 55 : 35}px;
        }

        .error.mobile {
          top: -${error.includes('\n') ? 60 : 40}px;
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
