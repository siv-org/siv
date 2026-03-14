import { validate as validateEmail } from 'email-validator'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { api } from 'src/api-helper'

import { Spinner } from '../Spinner'

export function LoginFormSection() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const submitRef = useRef<HTMLButtonElement>(null)

  const handleSubmit = async () => {
    if (!email) return
    if (!validateEmail(email)) {
      setError('Not a valid email address')
      return
    }
    setError('')
    setPending(true)
    const response = await api('admin-login', { email })
    setPending(false)
    if (response.status === 400) {
      setError('Invalid email address')
    } else if (response.status === 404) {
      setError('Not an approved account. Check for typos, or Create Account below.')
    } else {
      router.push(`./enter-login-code?email=${email}`)
    }
  }

  return (
    <div className="mt-8">
      {error && (
        <p
          className="mb-3 rounded-lg border border-red-200 bg-red-50/80 px-3 py-2 text-[0.8rem] font-medium text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          aria-label="Login email"
          className="min-w-0 flex-1 rounded-lg border border-h26-border bg-white px-4 py-3 text-[0.95rem] text-h26-text outline-none transition-colors placeholder:text-h26-muted focus:border-h26-green focus:ring-2 focus:ring-h26-green/20"
          onChange={(e) => {
            setEmail(e.target.value)
            setError('')
          }}
          onKeyDown={(e) => e.key === 'Enter' && submitRef.current?.click()}
          placeholder="you@example.com"
          type="email"
          value={email}
        />
        <button
          className="shrink-0 rounded-full px-8 py-3 text-[0.92rem] font-medium shadow-h26-cta transition-all duration-200 hover:-translate-y-0.5 hover:shadow-h26-cta-hover disabled:opacity-70 disabled:hover:translate-y-0"
          disabled={pending}
          onClick={handleSubmit}
          ref={submitRef}
          style={{ backgroundColor: '#1a6b4a', color: '#fff' }}
          type="button"
        >
          {pending ? <Spinner /> : 'Send code'}
        </button>
      </div>
    </div>
  )
}
