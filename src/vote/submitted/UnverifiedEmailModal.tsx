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

      // No voter found or already pre-approved
      if (response.status >= 400) return

      const status = await response.text()
      // Show warning if unverified
      if (status == 'Unverified') {
        setModalOpen(true)
        setEmail(localStorage.getItem(`registration-${auth}`) || 'your email')
      }
    }
    getVerificationStatus()
  }, [])

  return (
    <div>
      {email && email.includes('@') && (
        <p className="inline-block w-auto p-2 font-medium border-2 border-yellow-400 border-dashed">
          ⚠️ A verification email was sent to {email}
        </p>
      )}

      {/* Modal */}
      <div
        className={`absolute inset-0  transition-opacity duration-500 ease-in-out bg-gray-900/60 ${
          isModalOpen ? 'opacity-100 z-20' : 'opacity-0 -z-10'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div
            className={`p-3 transition-transform duration-500 ease-in-out transform  bg-white rounded-lg ${
              isModalOpen ? 'scale-100' : 'scale-0'
            }`}
          >
            <div className="flex justify-end">
              {/* Close Button */}
              <a
                className="text-gray-500 bg-transparent shadow-none cursor-pointer hover:text-gray-700"
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

            {/* Message Box */}
            <p className="p-4 text-lg text-center">A Verification Email has been sent to {email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
