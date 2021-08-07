import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { GlobalCSS } from 'src/GlobalCSS'
import { OnClickButton } from 'src/landing-page/Button'

import { api } from '../../api-helper'
import { Head } from '../../Head'
import { checkLoginCode } from '../auth'
import { AboutSection } from './AboutSection'
import { CreateAccount } from './CreateAccount'
import { Headerbar } from './Headerbar'

export const breakpoint = 500

export const LoginPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loginCode, setLoginCode] = useState('')
  const [status, setStatus] = useState<'' | 'pending' | 'sent' | 'error' | 'unapproved'>('')

  // Check if there's a redirect message in URL
  useEffect(() => {
    const { email, expired, invalid } = router.query
    if (email) setEmail(email as string)
    if (expired) setError('This login link has expired, click Sign In below to create another.')
    if (invalid) setError('This login link appears invalid, click Sign In below to create another.')
  }, [])

  return (
    <main>
      <Head title="Admin Login" />
      <Headerbar />
      <div className="container">
        <div className="columns">
          <AboutSection />
          <div className="spacer" />
          <CreateAccount />
        </div>
      </div>
      <div style={{ display: 'none' }}>
        {status !== 'sent' ? (
          <div className="mt-8 space-y-6">
            <div className="-space-y-px rounded-md shadow-sm">
              {error && <label className="error">⚠️&nbsp; {error}</label>}
              <label className="sr-only" htmlFor="email-address">
                Email address
              </label>
              <input
                required
                autoComplete="email"
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                id="email-address"
                name="email"
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setStatus('')
                  setError('')
                }}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    document.getElementById('email-address')?.blur()
                    document.getElementById('login-button')?.click()
                  }
                }}
              />
            </div>

            {status !== 'unapproved' && (
              <p className="text-xs italic font-medium text-gray-400">You will be emailed a login link.</p>
            )}

            <button
              className="relative flex justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-blue-800 border border-transparent rounded-md group disabled:opacity-50 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={!['', 'unapproved'].includes(status)}
              id="login-button"
              onClick={async () => {
                setError('')
                // Redirect to 'Request Access'
                if (status === 'unapproved') {
                  return window.location.assign('/for-governments#give-your-voters')
                }

                setStatus('pending')

                // Send login request to backend
                const response = await api('admin-login', { email })

                if (response.status === 400) {
                  setError('Invalid email address')
                  setStatus('error')
                } else if (response.status === 404) {
                  setError(
                    'The email you entered is not an approved SIV Election Manager. If you believe this is an error, you can try again with another email address.',
                  )
                  setStatus('unapproved')
                } else {
                  setStatus('sent')
                }
              }}
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                {/* Heroicon name: solid/lock-closed */}
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-blue-500 group-hover:text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    fillRule="evenodd"
                  />
                </svg>
              </span>
              {status === '' && 'Sign in'}
              {status === 'pending' && 'Sending...'}
              {status === 'error' && 'Error.'}
              {status === 'unapproved' && 'Request Access'}
            </button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <p className="text-sm">An email with login information is being sent to:</p>
              <p className="font-semibold">{email}</p>
            </div>

            <div>
              <label className="mt-8 text-xs font-semibold">Code:</label>
              <div className="flex">
                <input
                  className="relative flex-grow block px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                  placeholder="123456"
                  type="text"
                  value={loginCode}
                  onChange={({ target }) => {
                    setError('')
                    const next = target.value
                    // Allow up to 6 numbers only
                    if (/^\d{0,6}$/.test(next)) return setLoginCode(next)
                    setError('Login codes are 6 digit numbers')
                  }}
                />
                <OnClickButton
                  style={{ margin: 0, marginLeft: 20, padding: '10px 20px' }}
                  onClick={() => {
                    checkLoginCode({
                      clientSideRedirect: false,
                      code: loginCode,
                      email,
                      onExpired: () => {
                        setError("This login link has expired, we're sending you another.")
                        setLoginCode('')
                        api('admin-login', { email })
                      },
                      onInvalid: () => setError('Incorrect code'),
                      router,
                    })
                  }}
                >
                  Submit
                </OnClickButton>
              </div>
              <label className="error" style={{ opacity: error ? 1 : 0 }}>
                ⚠️&nbsp; {error}
              </label>
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          padding: 0 3vw;
        }

        .columns {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: calc(100vh - 68px);
          flex: 1;
          max-width: 1000px;
        }

        .spacer {
          width: 15px;
        }

        .error {
          color: red;
          opacity: 0.7;
          font-size: 12px;
        }

        @media (max-width: ${breakpoint}px) {
          .columns {
            flex-direction: column;
          }
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
