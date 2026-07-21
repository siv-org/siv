import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { api } from 'src/api-helper'

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
        <div className="p-6 mx-auto max-w-lg bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="m-0 text-2xl text-center text-black/70">
            {isSuccess ? (
              <>
                <span className="relative mr-3 top-0.5">✅</span>
                {!invalid ? (
                  <>
                    Your email <span className="mx-1 italic text-black">{email}</span> has been successfully verified.
                  </>
                ) : (
                  <>
                    The vote was successfully marked invalid.
                    <br />
                    Thank you
                  </>
                )}
              </>
            ) : (
              error
            )}
          </p>
        </div>
      </section>
    </>
  )
}

export default VerifyRegistrationPage
