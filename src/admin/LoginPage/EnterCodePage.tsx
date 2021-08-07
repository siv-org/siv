import { TextField } from '@material-ui/core'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { GlobalCSS } from 'src/GlobalCSS'
import { OnClickButton } from 'src/landing-page/Button'

import { api } from '../../api-helper'
import { Head } from '../../Head'
import { checkLoginCode } from '../auth'
import { Headerbar } from './Headerbar'

export const breakpoint = 500

export const EnterCodePage = () => {
  const router = useRouter()
  const { email, expired, invalid } = router.query
  const [error, setError] = useState('')
  const [loginCode, setLoginCode] = useState('')
  const submitBtn = useRef<HTMLAnchorElement>(null)

  const handleExpired = () => {
    setError('This login code has expired.\nSending you another...')
    api('admin-login', { email })
  }

  // Check if there's a redirect message in URL
  useEffect(() => {
    if (expired) {
      handleExpired()
      router.replace(`${window.location.pathname}?email=${email}`)
    }
    if (invalid) setError('This login link appears invalid, click Sign In below to create another.')
  }, [expired, invalid])

  if (typeof email !== 'string') return <p>Missing email</p>

  return (
    <main>
      <Head title="Admin Login" />
      <Headerbar hideLogin />
      <section>
        <p>An email with login information is being sent to:</p>
        <h3>{email}</h3>

        <div>
          <TextField
            autoFocus
            label="Code in Email"
            placeholder="123456"
            size="small"
            style={{ backgroundColor: '#fff' }}
            value={loginCode}
            variant="outlined"
            onChange={({ target }) => {
              setError('')
              const next = target.value
              // Allow up to 6 numbers only
              if (/^\d{0,6}$/.test(next)) return setLoginCode(next)
              setError('Login codes are 6 digit numbers')
            }}
            onKeyPress={(event) => event.key === 'Enter' && submitBtn.current?.click()}
          />
          <OnClickButton
            ref={submitBtn}
            style={{ margin: 0, marginLeft: 10, padding: '8px 20px' }}
            onClick={() => {
              if (loginCode.length < 6) return setError(`Login codes are 6 digits, not ${loginCode.length}`)

              checkLoginCode({
                code: loginCode,
                email,
                onExpired: () => {
                  setLoginCode('')
                  handleExpired()
                },
                onInvalid: () => setError('Incorrect code'),
                router,
              })
            }}
          >
            Submit
          </OnClickButton>
        </div>
        <div className="error" style={{ opacity: error ? '' : 0 }}>
          ⚠️&nbsp; {error}
        </div>
      </section>
      <style jsx>{`
        section {
          text-align: center;
          margin-top: 3rem;
          padding: 0 5px;
        }

        p {
          margin: 0;
          font-size: 24px;
        }

        h3 {
          margin: 2rem 0;
        }

        .error {
          color: red;
          opacity: 0.75;
          font-size: 12px;
          font-weight: 700;

          border: 1px solid #f00a;
          padding: 5px;
          border-radius: 5px;

          margin-top: 1rem;
          display: inline-block;

          white-space: pre-wrap;
        }
      `}</style>
      <style global jsx>{`
        body {
          background: #f9fafb;
        }
      `}</style>
      <GlobalCSS />
    </main>
  )
}
