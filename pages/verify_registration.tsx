import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { api } from 'src/api-helper'

const VerifyRegistrationPage = () => {
  const router = useRouter()
  const { code, election_id, email } = router.query
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('Loading...')

  useEffect(() => {
    const verifyRegistration = async () => {
      try {
        const response = await api(`election/${election_id}/verify-registration-email-code`, {
          code,
          election_id,
          email,
        })

        if (response.ok) {
          setIsSuccess(true)
        } else {
          // Verification failed, display an error message or handle the error
          console.error('Verification failed:', response.status)
          setError((await response.json()).error)
        }
      } catch (error) {
        console.error('Error verifying registration:', error)
        setError(JSON.stringify(error))
      }
    }

    if (email && code && election_id) verifyRegistration()
  }, [email, code, election_id, router])

  return <h1 className="px-5">{isSuccess ? `Your email ${email} has been successfully verified` : error}</h1>
}

export default VerifyRegistrationPage
