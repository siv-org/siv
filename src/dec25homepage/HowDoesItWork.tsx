import { useState } from 'react'

export const HowDoesItWork = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button
        className="p-2 w-full max-w-xs font-medium bg-sky-100 rounded-md text-black/75 hover:bg-sky-200 active:bg-sky-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        How does it work?
      </button>

      {isOpen && (
        <ol>
          <li>1. Who can vote?</li>
        </ol>
      )}
    </>
  )
}
