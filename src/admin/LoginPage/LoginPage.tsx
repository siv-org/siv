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
import { MobileLogin } from './MobileLogin'

export const breakpoint = 500

export const LoginPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loginCode, setLoginCode] = useState('')

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
          <MobileLogin />
          <CreateAccount />
        </div>
      </div>
      <div style={{ display: 'none' }}>
        {status == 'sent' && (
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

        @media (max-width: ${breakpoint}px) {
          .columns {
            flex-direction: column;
            max-width: 322px;
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
