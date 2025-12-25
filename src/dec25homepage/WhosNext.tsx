import { useState } from 'react'

export const WhoShouldBeNext = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button
        className="p-4 !mt-4 rounded-lg border-transparent hover:border-amber-600/20 hover:bg-amber-50/20 active:bg-amber-50 border-2 font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        Who should be next?
      </button>

      {isOpen && <h2 className="text-sm text-gray-700 animate-pulse">Who do you want to hear from?</h2>}
    </div>
  )
}
