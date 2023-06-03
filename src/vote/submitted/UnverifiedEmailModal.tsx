import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { api } from 'src/api-helper'

export const UnverifiedEmailModal = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const { auth, election_id } = useRouter().query as { auth?: string; election_id?: string }

  useEffect(() => {
    async function getVerificationStatus() {
      const response = await api(`election/${election_id}/get-application-status`, { auth })

      if (response.status >= 400) return
      const { email } = await response.json()
      setEmail(email)
      if (email.includes('@')) setModalOpen(true)
    }
    getVerificationStatus()
  }, [])
  return (
    <div>
      {email && email.includes('@') && <p>A verification email was sent to {email} </p>}

      {/* Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-20 bg-gray-900/60">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="p-3 bg-white rounded-lg">
              <div className="flex justify-end">
                {/* Close Button */}
                <a
                  className="text-gray-500 bg-transparent shadow-none hover:text-gray-700"
                  onClick={() => setModalOpen(false)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  </svg>
                </a>
              </div>
              <div className="p-4 text-center">
                {/* Message Box */}
                <p className="text-lg">A Verification Email has been sent to {email}.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
