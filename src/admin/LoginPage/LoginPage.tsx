import 'tailwindcss/tailwind.css'

import Router from 'next/router'
import { useEffect, useState } from 'react'

import { api } from '../../api-helper'
import { Head } from '../../Head'

export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'' | 'pending' | 'sent' | 'error' | 'unapproved'>('')

  // Check if there's a redirect message in URL
  useEffect(() => {
    const { email, expired, invalid } = Router.query
    if (email) setEmail(email as string)
    if (expired) setError('This login link has expired, click Sign In below to create another.')
    if (invalid) setError('This login link appears invalid, click Sign In below to create another.')
  }, [])

  return (
    <main className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <Head title="Admin Login" />
      <p className="text-blue-800 request-access-link">
        <a href="/for-governments#give-your-voters">
          <b>New user?</b>
          <br />
          <span className="text-xs">Request access</span>
        </a>
      </p>
      <div className="w-full max-w-md mb-24 space-y-8">
        <h1 className="mb-16 text-2xl font-bold text-center gradient-background">Secure Internet Voting</h1>
        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">Sign in to your secure account</h2>

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

              console.log('response', response)
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
            {status === 'sent' && 'Sent.'}
            {status === 'error' && 'Error.'}
            {status === 'unapproved' && 'Request Access'}
          </button>
        </div>
      </div>
      <style jsx>{`
        .gradient-background {
          background: linear-gradient(90deg, #010b26 0%, #072054 100%);
          color: #fff;
          padding: 8px;
        }

        .error {
          color: red;
          opacity: 0.7;
          font-size: 12px;
        }

        .request-access-link {
          font-size: 14px;
          position: absolute;
          top: 15px;
          right: 20px;
          text-align: right;
        }
        .request-access-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </main>
  )
}
