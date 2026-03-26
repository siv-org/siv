import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { api } from 'src/api-helper'
import { Head } from 'src/Head'
import { TailwindPreflight } from 'src/TailwindPreflight'

import { h26fonts } from '../../homepage2026/fonts'
import { Footer } from '../../homepage2026/Footer'
import { Nav } from '../../homepage2026/Nav'
import { checkLoginCode } from '../auth'

const PageTitle = 'Admin Enter Login Code'

export const EnterLoginCodePage = () => {
  const router = useRouter()
  const { email, expired, invalid } = router.query
  const [error, setError] = useState('')
  const [loginCode, setLoginCode] = useState('')
  const submitRef = useRef<HTMLButtonElement>(null)

  function handleExpired() {
    setError('This login code has expired. Sending you another...')
    api('admin-login', { email })
  }
  const resetURL = () => router.replace(`${window.location.pathname}?email=${email}`)

  // Check if there's a redirect message in URL
  useEffect(() => {
    if (expired) {
      handleExpired()
      resetURL()
    }
    if (invalid) {
      setError('This login link appears invalid. Sending you another...')
      api('admin-login', { email })
      resetURL()
    }
  }, [expired, invalid])

  // Error page if their URL params are missing email
  if (typeof email !== 'string') {
    return (
      <div className={`p-8 min-h-screen bg-h26-bg ${h26fonts}`}>
        <Head title={PageTitle} />
        <p className="text-h26-textSecondary">Missing email. Please start from the login page.</p>
        <a className="inline-block mt-4 text-h26-green hover:underline" href="/login">
          Back to login
        </a>
        <TailwindPreflight />
      </div>
    )
  }

  return (
    <div className={`flex flex-col justify-between min-h-screen antialiased bg-h26-bg text-h26-text ${h26fonts}`}>
      <Head title={PageTitle} />
      <Nav />

      <main className="px-7 pt-[7rem] pb-16 md:pt-[8.5rem] mx-auto max-w-[440px] animate-[fadeInUp_0.8s_ease-out_both] text-center">
        {/* Instructions */}
        <h1 className="font-serif26 text-[clamp(1.5rem,3.5vw,2rem)] tracking-tight">Check your email</h1>
        <p className="mt-3 text-[0.9rem] text-h26-textSecondary">We sent a one-time code to:</p>
        <p className="mt-2 mb-8 font-medium text-h26-text">{email}</p>

        {/* Error message */}
        {error && (
          <p
            className=" mb-3 rounded-lg border border-red-200 bg-red-50/80 px-3 py-2 text-[0.8rem] font-medium text-red-700 whitespace-pre-wrap text-left"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Input code form */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Code input */}
          <input
            aria-label="Code from email"
            autoFocus
            className="min-w-0 flex-1 rounded-lg border border-h26-border bg-white px-4 py-3 text-[1rem] text-h26-text tracking-[0.15em] outline-none transition-colors placeholder:text-h26-muted focus:border-h26-green focus:ring-2 focus:ring-h26-green/20"
            inputMode="numeric"
            maxLength={6}
            onChange={({ target }) => {
              const next = target.value
              if (/^\d{0,6}$/.test(next)) {
                setLoginCode(next)
                setError('')
              } else if (next.length > 0) {
                setError('Login codes are 6 digit numbers')
              }
            }}
            onKeyDown={(e) => e.key === 'Enter' && submitRef.current?.click()}
            placeholder="123456"
            type="text"
            value={loginCode}
          />
          {/* Submit button */}
          <button
            className="shrink-0 rounded-full px-8 py-3 text-[0.92rem] font-medium shadow-h26-cta transition-all duration-200 hover:-translate-y-0.5 hover:shadow-h26-cta-hover"
            onClick={() => {
              if (loginCode.length < 6) {
                setError(`Login codes are 6 digits, not ${loginCode.length}`)
                return
              }
              checkLoginCode({
                code: loginCode,
                email,
                onExpired: () => {
                  setLoginCode('')
                  handleExpired()
                },
                onInvalid: (message: string) => setError(message || 'Unknown error signing in'),
                router,
              })
            }}
            ref={submitRef}
            style={{ backgroundColor: '#1a6b4a', color: '#fff' }}
            type="button"
          >
            Submit
          </button>
        </div>

        {/* Use different email link */}
        <p className="mt-6 text-[0.82rem] text-h26-muted">
          <a className="text-h26-green hover:underline" href="/login">
            Use a different email
          </a>
        </p>
      </main>

      <Footer />
      <TailwindPreflight />
    </div>
  )
}
