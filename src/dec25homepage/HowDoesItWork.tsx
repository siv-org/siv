import { useState } from 'react'

export const HowDoesItWork = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="w-full max-w-xs">
      <button
        className="p-2 w-full max-w-xs font-medium bg-sky-100 rounded-md text-black/75 hover:bg-sky-200 active:bg-sky-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        How does it work?
      </button>

      {isOpen && (
        <div className="px-1.5 pt-3.5 pb-6 w-full text-center shadow-lg max-w-xs border">
          <section>
            <span className="p-1 mr-2.5 text-xs font-semibold bg-purple-200 rounded-md text-purple-700/90">Setup</span>
            <span className="mr-14 text-xs font-medium uppercase">Define your</span>
            <ol className="flex justify-between mt-1.5 w-full">
              <li>
                <span className="inline-flex justify-center items-center mr-1.5 w-7 h-7 font-semibold text-green-800 text-sm bg-green-200 rounded-full">
                  1
                </span>
                Voters List
              </li>
              <li>
                <span className="inline-flex justify-center items-center mr-1.5 w-7 h-7 font-semibold text-orange-800 text-sm bg-orange-200 rounded-full">
                  2
                </span>
                Question(s)
              </li>
            </ol>
          </section>

          <section className="pt-4 mt-4 border-t border-gray-400/70">
            <span className="text-xs font-medium uppercase">Voting Period</span>
          </section>

          <section className="pt-4 mt-4 border-t border-gray-400/70">
            <span className="text-xs font-medium uppercase">Voter Verifiable Results</span>
          </section>
        </div>
      )}
    </div>
  )
}
