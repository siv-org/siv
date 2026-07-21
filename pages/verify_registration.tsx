import { CircleCheck } from 'lucide-react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { api } from 'src/api-helper'
import { TailwindPreflight } from 'src/TailwindPreflight'

const VerifyRegistrationPage = () => {
  const { code, election_id, email, invalid, link_auth } = useRouter().query
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('Loading...')

  useEffect(() => {
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
          setIsSuccess(true)
        } else {
          // Verification failed, display an error message or handle the error
          console.error('Verification failed:', response.status)
          setError((await response.json()).error)
        }
      } catch (error) {
        // Network error
        console.error('Error verifying registration:', error)
        setError(JSON.stringify(error))
      }
    }

    if (link_auth && code && election_id) verifyRegistration()
  }, [link_auth, code, election_id])

  return (
    <>
      <Head>
        <title>Verify email | SIV</title>
      </Head>

      <section className="px-4 py-12">
        <div
          className={`p-6 mx-auto max-w-lg rounded-xl border shadow-sm ${
            isSuccess ? 'text-center border-green-200 bg-green-50/50' : 'bg-white border-gray-200'
          }`}
        >
          {isSuccess ? (
            <>
              <CircleCheck aria-hidden className="mx-auto mb-4 text-green-600" size={40} />
              {!invalid ? (
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
          ) : (
            <p className="m-0 text-2xl text-center text-black/70">{error}</p>
          )}
        </div>
        <TailwindPreflight />
      </section>
    </>
  )
}

export default VerifyRegistrationPage
