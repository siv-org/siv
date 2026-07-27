import { CircleAlert, CircleCheck, LoaderCircle } from 'lucide-react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { api } from 'src/api-helper'
import { TailwindPreflight } from 'src/TailwindPreflight'

type Status = { kind: 'error'; message: string } | { kind: 'loading' } | { kind: 'success' }

const VerifyRegistrationPage = () => {
  const router = useRouter()
  const { code, election_id, email, invalid, link_auth } = router.query
  const [status, setStatus] = useState<Status>({ kind: 'loading' })

  useEffect(() => {
    if (!router.isReady) return

    // Error if any required params missing
    if (
      typeof code !== 'string' ||
      typeof election_id !== 'string' ||
      typeof link_auth !== 'string' ||
      (invalid !== undefined && invalid !== 'true') ||
      (invalid !== 'true' && typeof email !== 'string')
    )
      return setStatus({ kind: 'error', message: 'This verification link is incomplete.' })

    const verifyRegistration = async () => {
      try {
        const response = await api(`election/${election_id}/verify-link-auth-email-code`, {
          code,
          election_id,
          email,
          invalid,
          link_auth,
        })

        if (response.ok) {
          setStatus({ kind: 'success' })
        } else {
          // Verification failed, display an error message or handle the error
          console.error('Verification failed:', response.status)
          setStatus({ kind: 'error', message: (await response.json()).error || 'This verification link is invalid.' })
        }
      } catch (error) {
        // Network error
        console.error('Error verifying registration:', error)
        setStatus({
          kind: 'error',
          message: 'Please check your connection and refresh the page to try again.',
        })
      }
    }

    verifyRegistration()
  }, [code, election_id, email, invalid, link_auth, router.isReady])

  return (
    <>
      <Head>
        <title>Verify email | SIV</title>
      </Head>

      <section className="px-4 py-12">
        <div
          className={`p-6 mx-auto max-w-lg text-center rounded-xl border shadow-sm ${
            status.kind === 'success'
              ? 'border-green-200 bg-green-50/50'
              : status.kind === 'error'
              ? 'border-red-200 bg-red-50/50'
              : 'bg-white border-gray-200'
          }`}
        >
          {status.kind === 'success' ? (
            <>
              <CircleCheck aria-hidden className="mx-auto mb-4 text-green-600" size={40} />
              {invalid !== 'true' ? (
                <>
                  <h1 className="m-0 text-2xl font-semibold text-gray-900">Email verified</h1>
                  <p className="mt-2 mb-0 text-base text-black/70">
                    <strong className="text-gray-900 break-words">{email}</strong> has been successfully verified.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="m-0 text-2xl font-semibold text-gray-900">Vote marked invalid</h1>
                  <p className="mt-2 mb-0 text-base text-black/70">Thanks for letting us know.</p>
                </>
              )}
              <p className="mt-4 mb-0 text-sm text-black/50">You can close this window.</p>
            </>
          ) : status.kind === 'error' ? (
            <>
              <CircleAlert aria-hidden className="mx-auto mb-4 text-red-600" size={40} />
              <h1 className="m-0 text-2xl font-semibold text-gray-900">We couldn’t verify this link</h1>
              <p className="mt-2 mb-0 text-base text-black/70">{status.message}</p>
            </>
          ) : (
            <>
              <LoaderCircle aria-hidden className="mx-auto mb-4 text-cyan-700 animate-spin" size={36} />
              <h1 className="m-0 text-2xl font-semibold text-gray-900">Verifying your email…</h1>
              <p className="mt-2 mb-0 text-base text-black/60">This should only take a moment.</p>
            </>
          )}
        </div>
        <TailwindPreflight />
      </section>
    </>
  )
}

export default VerifyRegistrationPage
