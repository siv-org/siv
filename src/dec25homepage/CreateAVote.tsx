import { useState } from 'react'
import { api } from 'src/api-helper'

const newline = ''.padEnd(100)

export const CreateAVote = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  return (
    <>
      <button
        className="relative p-2 w-full max-w-xs font-bold text-white bg-blue-600 rounded hover:bg-blue-800 active:xbg-blue-900 active:top-0.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        Create A Vote
      </button>

      {isOpen && (
        <div className="p-2 w-full bg-amber-50 border border-amber-400 rounded-t-none rounded !-mt-2 max-w-xs mb-8">
          <h1 className="text-lg font-bold">Vote on what?</h1>
          <textarea
            className="block p-1.5 rounded-lg w-full min-h-16"
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={`Describe your vote${newline}10 word summary`}
          />
          <button
            className="p-1 mt-3 w-full max-w-xs font-bold text-white bg-green-600 rounded-md hover:bg-green-700 active:bg-green-800"
            onClick={() => {
              alert(`Still testing: ${question}`)
              api('dec25/create-vote', { question })
            }}
          >
            Next
          </button>
        </div>
      )}
    </>
  )
}
