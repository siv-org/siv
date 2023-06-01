import { useState } from 'react'

export const UnverifiedEmailModal = ({ emailAddress }: { emailAddress: string }) => {
  const [isModalOpen, setModalOpen] = useState(true)

  return (
    <div className={`${isModalOpen ? 'bg-gray-900/60' : ''} absolute inset-0 z-20`}>
      {/* Modal */}
      {isModalOpen && (
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
              <p className="text-lg">A Verification Email has been sent to {emailAddress}.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
