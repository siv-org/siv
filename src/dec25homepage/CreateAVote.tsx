import { useState } from 'react'
import { api } from 'src/api-helper'

const newline = ''.padEnd(100)

export const CreateAVote = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  return (
    <div className="max-w-[23rem] w-full">
      <button
        className={`relative p-2 w-full font-bold text-white bg-blue-600 rounded hover:bg-blue-800 active:xbg-blue-900  ${
          isOpen ? 'rounded-b-none' : 'active:top-0.5'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        Create A Vote
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-2 mb-8 w-full bg-amber-50 rounded rounded-t-none border border-t-0 border-amber-400">
          <h1 className="mb-1 text-base font-bold">Vote on what?</h1>
          <textarea
            className="block p-1.5 rounded-lg w-full min-h-16"
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={`Describe your vote${newline}in a few words`}
          />
          <button
            className={`p-1 mt-3 w-full font-bold text-white bg-green-600 rounded-md  ${
              !question ? 'opacity-50' : 'hover:bg-green-700 active:bg-green-800'
            }`}
            disabled={!question}
            onClick={() => {
              alert(`Still testing: ${question}`)
              api('dec25/create-vote', { question })
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
