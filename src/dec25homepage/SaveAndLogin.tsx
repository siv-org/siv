import { validate as validateEmail } from 'email-validator'
import { KeyboardEvent, useRef, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'
import { api } from 'src/api-helper'

export const SaveAndLogin = ({
  isOpen,
  onClose,
  onLogin,
}: {
  isOpen: boolean
  onClose: () => void
  onLogin?: (email: string) => void
}) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const loginButton = useRef<HTMLAnchorElement>(null)

  if (!isOpen) return null

  const handleEmailLogin = async () => {
    if (!email) return setError('Please enter your email address')
    if (!validateEmail(email)) return setError('Not a valid email address')

    setPending(true)
    const response = await api('admin-login', { email })
    setPending(false)

    if (response.status === 400) {
      setError('Invalid email address')
    } else if (response.status === 404) {
      setError('Not an approved account. Check for typos.')
    } else {
      onLogin?.(email)
      onClose()
    }
  }

  return (
    // Page overlay
    <div
      className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-70"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Modal box */}
      <div className="relative p-8 mx-4 w-full max-w-sm bg-white rounded-lg">
        {/* Close button */}
        <button
          aria-label="Close modal"
          className="absolute top-1 right-3 text-4xl font-thin text-gray-500 bg-transparent border-none cursor-pointer hover:text-black"
          onClick={onClose}
        >
          ×
        </button>

        {/* Title */}
        <h2 className="mb-4 text-2xl font-bold">Save Your Work</h2>

        {/* Email input */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Your Email:</label>
          <input
            autoFocus
            className="block p-2 px-3 mb-2 w-full rounded border border-gray-300 hover:bg-lime-50/50"
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') loginButton.current?.click()
            }}
            placeholder="you@email.com"
            type="email"
            value={email}
          />
          {error && (
            <p className="text-sm text-red-600" style={{ opacity: error ? '' : 0 }}>
              ⚠️ {error}
            </p>
          )}
        </div>

        {/* Login button */}
        <OnClickButton
          className="text-center"
          onClick={handleEmailLogin}
          ref={loginButton}
          style={{ margin: 0, padding: '0.75rem 1.5rem', width: '100%' }}
        >
          {pending ? 'Sending...' : 'Next'}
        </OnClickButton>

        {/* Continue as Guest */}
        <div className="mt-8 text-center">
          Or{' '}
          <a
            className="text-blue-800 cursor-pointer hover:text-blue-600 hover:underline"
            onClick={() => {
              alert('Coming soon')
            }}
          >
            continue as guest
          </a>
        </div>
      </div>
    </div>
  )
}
