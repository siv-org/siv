import { validate as validateEmail } from 'email-validator'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { api } from 'src/api-helper'

import { Spinner } from '../Spinner'
import { attemptInitLoginCode } from './CreateAccount'
import { CreatedAccountWaiting } from './CreatedAccountWaiting'

export function LoginFormSection() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [step, setStep] = useState<'email' | 'signup'>('email')
  const [submittedEmail, setSubmittedEmail] = useState<null | string>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [org, setOrg] = useState('')
  const [electionCategory, setElectionCategory] = useState<'' | 'Government' | 'NGO' | 'other' | 'Social'>('')
  const [electionCategoryOther, setElectionCategoryOther] = useState('')
  const [electionDate, setElectionDate] = useState('')
  const [electionNumVoters, setElectionNumVoters] = useState('')
  const submitRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    attemptInitLoginCode()
  }, [])

  const handleEmailSubmit = async () => {
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
      setStep('signup')
      setError('')
    } else {
      router.push(`./enter-login-code?email=${encodeURIComponent(email)}`)
    }
  }

  const handleSignupSubmit = async () => {
    if (!firstName.trim() || !lastName.trim() || !org.trim()) {
      setError('Please fill in first name, last name, and organization.')
      return
    }
    const election_type =
      electionCategory === 'other' ? electionCategoryOther.trim() : electionCategory === '' ? '' : electionCategory
    if (!election_type || !electionDate.trim() || !electionNumVoters.trim()) {
      setError('Please choose how you’ll use SIV, and add a date and approximate number of voters.')
      return
    }
    setError('')
    setPending(true)
    const response = await api('admin-create-account', {
      election_date: electionDate.trim(),
      election_num_voters: electionNumVoters.trim(),
      election_type,
      email: email.toLowerCase(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      your_organization: org.trim(),
    })
    setPending(false)
    if (response.status !== 200) {
      const data = await response.json().catch(() => ({}))
      setError(data?.error ?? 'Something went wrong. Please try again.')
      return
    }
    const data = await response.json()
    const { init_login_code } = data
    localStorage.setItem('siv-admin-init', JSON.stringify({ code: init_login_code, email: email.toLowerCase() }))
    setSubmittedEmail(email.toLowerCase())
  }

  if (submittedEmail) return <CreatedAccountWaiting email={submittedEmail} />

  if (step === 'signup') {
    return (
      <div className="mt-8">
        <p className="mb-4 text-[0.9rem] text-h26-textSecondary">
          No account found for this email. Enter your details to request access.
        </p>
        {error && (
          <p
            className="mb-3 rounded-lg border border-red-200 bg-red-50/80 px-3 py-2 text-[0.8rem] font-medium text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-1 block text-[0.75rem] font-medium uppercase tracking-wider text-h26-muted">Email</span>
            <input
              className="w-full rounded-lg border border-h26-border bg-white px-3 py-2.5 text-[0.95rem] text-h26-text outline-none focus:border-h26-green focus:ring-1 focus:ring-h26-green/30 bg-h26-bg/50"
              readOnly
              type="email"
              value={email}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[0.75rem] font-medium uppercase tracking-wider text-h26-muted">
                First name
              </span>
              <input
                className="w-full rounded-lg border border-h26-border bg-white px-3 py-2.5 text-[0.95rem] text-h26-text outline-none focus:border-h26-green focus:ring-1 focus:ring-h26-green/30"
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                value={firstName}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[0.75rem] font-medium uppercase tracking-wider text-h26-muted">
                Last name
              </span>
              <input
                className="w-full rounded-lg border border-h26-border bg-white px-3 py-2.5 text-[0.95rem] text-h26-text outline-none focus:border-h26-green focus:ring-1 focus:ring-h26-green/30"
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                value={lastName}
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-[0.75rem] font-medium uppercase tracking-wider text-h26-muted">
              Your organization
            </span>
            <input
              className="w-full rounded-lg border border-h26-border bg-white px-3 py-2.5 text-[0.95rem] text-h26-text outline-none focus:border-h26-green focus:ring-1 focus:ring-h26-green/30"
              onChange={(e) => setOrg(e.target.value)}
              type="text"
              value={org}
            />
          </label>
          <div className="rounded-xl border border-h26-border/25 bg-white/90 p-5 shadow-sm">
            <h2 className="font-serif26 text-[1.05rem] font-normal leading-snug text-h26-text">
              How do you want to use SIV?
            </h2>
            <p className="mt-1.5 text-[0.82rem] leading-relaxed text-h26-textSecondary">
              Ballpark answers are fine — this helps us understand your election.
            </p>
            <div className="grid gap-5 mt-5">
              <label className="block">
                <span className="mb-1.5 block text-[0.8125rem] font-medium text-h26-text">Election type</span>
                <select
                  className="w-full cursor-pointer appearance-none rounded-lg border border-h26-border bg-white bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat py-2.5 pl-3 pr-9 text-[0.95rem] text-h26-text outline-none focus:border-h26-green focus:ring-1 focus:ring-h26-green/30"
                  onChange={(e) => {
                    const v = e.target.value as '' | 'Government' | 'NGO' | 'other' | 'Social'
                    setElectionCategory(v === '' ? '' : v)
                    if (v !== 'other') setElectionCategoryOther('')
                  }}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  }}
                  value={electionCategory === '' ? '' : electionCategory}
                >
                  <option disabled value="">
                    Choose one
                  </option>
                  <option value="Government">Government</option>
                  <option value="NGO">NGO</option>
                  <option value="Social">Social</option>
                  <option value="other">Other…</option>
                </select>
              </label>
              {electionCategory === 'other' && (
                <label className="block -mt-1">
                  <span className="mb-1.5 block text-[0.8125rem] font-medium text-h26-text">Describe briefly</span>
                  <input
                    className="w-full rounded-lg border border-h26-border bg-white px-3 py-2.5 text-[0.95rem] text-h26-text outline-none placeholder:text-h26-muted/80 focus:border-h26-green focus:ring-1 focus:ring-h26-green/30"
                    onChange={(e) => setElectionCategoryOther(e.target.value)}
                    placeholder="What kind of election or vote?"
                    type="text"
                    value={electionCategoryOther}
                  />
                </label>
              )}
              <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-[0.8125rem] font-medium text-h26-text">Approx. election date</span>
                  <input
                    className="w-full max-w-full rounded-lg border border-h26-border bg-white px-3 py-2.5 text-[0.95rem] text-h26-text outline-none placeholder:text-h26-muted/80 focus:border-h26-green focus:ring-1 focus:ring-h26-green/30 sm:max-w-[220px]"
                    onChange={(e) => setElectionDate(e.target.value)}
                    placeholder="e.g. Nov 2025"
                    type="text"
                    value={electionDate}
                  />
                </label>
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-[0.8125rem] font-medium text-h26-text">
                    Approx. number of voters
                  </span>
                  <input
                    className="w-full max-w-full rounded-lg border border-h26-border bg-white px-3 py-2.5 text-[0.95rem] text-h26-text outline-none placeholder:text-h26-muted/80 focus:border-h26-green focus:ring-1 focus:ring-h26-green/30 sm:max-w-[180px]"
                    inputMode="numeric"
                    onChange={(e) => setElectionNumVoters(e.target.value)}
                    placeholder="e.g. 500"
                    type="text"
                    value={electionNumVoters}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              className="rounded-full px-6 py-2.5 text-[0.9rem] font-medium text-h26-textSecondary hover:text-h26-text"
              onClick={() => {
                setStep('email')
                setError('')
                setFirstName('')
                setLastName('')
                setOrg('')
                setElectionCategory('')
                setElectionCategoryOther('')
                setElectionDate('')
                setElectionNumVoters('')
              }}
              type="button"
            >
              Use a different email
            </button>
            <button
              className="rounded-full px-8 py-3 text-[0.92rem] font-medium shadow-h26-cta transition-all duration-200 hover:-translate-y-0.5 hover:shadow-h26-cta-hover disabled:opacity-70 disabled:hover:translate-y-0"
              disabled={pending}
              onClick={handleSignupSubmit}
              style={{ backgroundColor: '#1a6b4a', color: '#fff' }}
              type="button"
            >
              {pending ? <Spinner /> : 'Request account'}
            </button>
          </div>
        </div>
      </div>
    )
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
          aria-label="Email"
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
          onClick={handleEmailSubmit}
          ref={submitRef}
          style={{ backgroundColor: '#1a6b4a', color: '#fff' }}
          type="button"
        >
          {pending ? <Spinner /> : 'Continue'}
        </button>
      </div>
    </div>
  )
}
