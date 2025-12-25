import { useState } from 'react'

export const WhoShouldBeNext = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button
        className={`p-4 !mt-4 rounded-lg hover:border-amber-600/20 hover:bg-amber-50/20 border-2 font-semibold border-transparent ${
          isOpen ? '!bg-amber-50 border-amber-600/5':''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        Who should be next?
      </button>

      <h2
        className={`mt-4 text-sm text-gray-700 transition-opacity duration-300 ${
          isOpen ? 'animate-pulse' : 'opacity-0'
        }`}
      >
        Who do you want to hear from?
      </h2>
    </div>
  )
}
